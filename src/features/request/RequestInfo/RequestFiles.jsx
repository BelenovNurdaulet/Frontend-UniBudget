import { spacing } from '@ozen-ui/kit/MixSpacing';
import { Card } from '@ozen-ui/kit/Card';
import { Stack } from '@ozen-ui/kit/Stack';
import { Typography } from '@ozen-ui/kit/Typography';
import { Button } from '@ozen-ui/kit/ButtonNext';
import { Link } from '@ozen-ui/kit/Link';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@ozen-ui/kit/Table';
import { useSnackbar } from '@ozen-ui/kit/Snackbar';
import { useRef } from 'react';
import { DeleteIcon, DownloadFileIcon, DownloadIcon, UploadIcon } from '@ozen-ui/icons';
import {
    useDeleteRequestFileMutation,
  useDownloadRequestFileMutation,
    useUploadRequestFilesMutation
} from "../requestApi.js";


const RequestFiles = ({ files, requestId, onFilesChanged, canManageFiles, canDeleteFiles }) => {
  const { pushMessage } = useSnackbar();
  const fileInputRef = useRef(null);
  const [downloadFile] = useDownloadRequestFileMutation();
  const [uploadFiles] = useUploadRequestFilesMutation();
  const [deleteFile] = useDeleteRequestFileMutation();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles?.length) return;

    try {
      await uploadFiles({ RequestId: requestId, Files: Array.from(selectedFiles) }).unwrap();
      onFilesChanged?.();
      event.target.value = '';
      pushMessage({
        title: '',
        description:
            selectedFiles.length > 1
                ? `Успешно загружено ${selectedFiles.length} файлов`
                : 'Файл успешно загружен',
        status: 'success',
      });
    } catch (error) {
      console.error('Failed to upload files:', error);
      pushMessage({
        title: 'Ошибка',
        description: `Не удалось загрузить файл(ы). Попробуйте еще раз. ${error?.data?.error || ''}`,
        status: 'error',
      });
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await deleteFile(fileId).unwrap();
      onFilesChanged?.();
      pushMessage({
        title: '',
        description: 'Файл успешно удален',
        status: 'success',
      });
    } catch (error) {
      console.error('Failed to delete file:', error);
      pushMessage({
        title: 'Ошибка',
        description: `Не удалось удалить файл. Попробуйте еще раз. ${error?.data?.error || ''}`,
        status: 'error',
      });
    }
  };

  const handleDownloadFile = async (fileName) => {
    try {
      const blob = await downloadFile({ RequestId: requestId, FileName: fileName }).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download file:', error);
      pushMessage({
        title: 'Ошибка',
        description: `Не удалось скачать файл. Попробуйте еще раз. ${error?.data?.error || ''}`,
        status: 'error',
      });
    }
  };

  return (
      <>
        <Stack direction="row" align="center" gap="m" className={spacing({ mb: 's' })}>
          <Typography variant="heading-l">Файлы</Typography>
          <Stack direction="row" gap="s">
            {canManageFiles && (
                <>
                  <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                      multiple
                  />
                  <Button
                      variant="contained"
                      size="s"
                      color="primary"
                      onClick={handleUploadClick}
                      iconLeft={<UploadIcon />}
                  >
                    Загрузить файлы
                  </Button>
                </>
            )}
          </Stack>
        </Stack>

        {(!files || files.length === 0) ? (
            <Card size="s" style={{ marginBottom: '1rem', padding: '1rem' }} shadow="m">
              <Typography variant="text-s">Нет файлов</Typography>
            </Card>
        ) : (
            <Card className={spacing({ mb: 'm' })} shadow="m" size="s">
              <TableContainer>
                <Table size="s" fullWidth divider="row" striped stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">№</TableCell>
                      <TableCell align="left">Название</TableCell>
                      {canDeleteFiles && <TableCell align="center">Действия</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {files.map((file, idx) => (
                        <TableRow key={file.id}>
                          <TableCell align="left" verticalAlign="center">
                            {idx + 1}
                          </TableCell>
                          <TableCell align="left" verticalAlign="center">
                            <Stack direction="row" align="center" gap="s">
                              <DownloadFileIcon size="s" color="primary" />
                              <Link
                                  onClick={() => handleDownloadFile(file.fileName)}
                                  variant="text-s"
                                  style={{ textDecoration: 'none', cursor: 'pointer' }}
                              >
                                {file.fileName}
                              </Link>
                            </Stack>
                          </TableCell>
                          {canDeleteFiles && (
                              <TableCell align="center">
                                <Button
                                    variant="function"
                                    size="s"
                                    color="error"
                                    onClick={() => handleDeleteFile(file.id)}
                                    iconLeft={<DeleteIcon color="var(--color-content-error)" />}
                                >
                                  Удалить
                                </Button>
                              </TableCell>
                          )}
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
        )}
      </>
  );
};

export default RequestFiles;
