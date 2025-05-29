import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
} from '@ozen-ui/kit/Drawer';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from '@ozen-ui/kit/Dialog';
import { Button } from '@ozen-ui/kit/ButtonNext';
import { Input } from '@ozen-ui/kit/Input';
import { Select, Option } from '@ozen-ui/kit/Select';
import { useSnackbar } from '@ozen-ui/kit/Snackbar';
import { Controller, useForm } from 'react-hook-form';
import { Typography } from '@ozen-ui/kit/Typography';
import { Stack } from '@ozen-ui/kit/Stack';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectBranches } from '../reference/referenceSlice';
import { ALL_ROLES, ROLE_LABELS } from '../../utils/rolesConfig.jsx';
import {
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '../UserProfle/userApi.js';

const EditUserDialog = ({ user, isOpen, onClose, onSuccess }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userName: '',
      email: '',
      userRole: '',
      branchId: '',
    },
  });

  const branches = useSelector(selectBranches);
  const { pushMessage } = useSnackbar();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (user) {
      reset({
        userName: user.userName || '',
        email: user.email || '',
        userRole: user.role || '',
        branchId: user.branchId?.toString() || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      await updateUser({
        userId: user.userId,
        userName: data.userName,
        email: data.email,
        userRole: data.userRole,
        branchId: parseInt(data.branchId, 10),
      });

      pushMessage({
        title: 'Успех',
        description: 'Пользователь обновлён',
        status: 'success',
      });

      onSuccess?.();
      onClose();
    } catch {
      pushMessage({
        title: 'Ошибка',
        description: 'Не удалось обновить данные',
        status: 'error',
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser({ id: user.userId }).unwrap();

      pushMessage({
        title: 'Успех',
        description: 'Пользователь удалён',
        status: 'success',
      });
      onSuccess?.();
      onClose();
    } catch {
      pushMessage({
        title: 'Ошибка',
        description: 'Не удалось удалить пользователя',
        status: 'error',
      });
    } finally {
      setIsConfirmOpen(false);
    }
  };

  if (!user) return null;

  return (
      <>
        <Drawer open={isOpen} onClose={onClose} size="l">
          <DrawerHeader>
            <DrawerTitle>Редактирование пользователя</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Stack direction="column" gap="m" fullWidth>
              <Controller
                  name="userName"
                  control={control}
                  rules={{ required: 'Имя обязательно' }}
                  render={({ field }) => (
                      <Input
                          {...field}
                          label="Имя пользователя"
                          fullWidth
                          required
                          error={!!errors.userName}
                      />
                  )}
              />
              <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: 'Email обязателен',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Некорректный email',
                    },
                  }}
                  render={({ field }) => (
                      <Input
                          {...field}
                          label="Email"
                          fullWidth
                          required
                          error={!!errors.email}
                      />
                  )}
              />
              <Controller
                  name="userRole"
                  control={control}
                  rules={{ required: 'Роль обязательна' }}
                  render={({ field }) => (
                      <Select
                          {...field}
                          label="Роль"
                          placeholder="Выберите роль"
                          fullWidth
                          required
                          error={!!errors.userRole}
                      >
                        {ALL_ROLES.map((role) => (
                            <Option key={role} value={role}>
                              {ROLE_LABELS[role] || role}
                            </Option>
                        ))}
                      </Select>
                  )}
              />
              <Controller
                  name="branchId"
                  control={control}
                  rules={{ required: 'Филиал обязателен' }}
                  render={({ field }) => (
                      <Select
                          {...field}
                          label="Филиал"
                          placeholder="Выберите филиал"
                          fullWidth
                          required
                          error={!!errors.branchId}
                      >
                        {branches.map((branch) => (
                            <Option key={branch.id} value={branch.id.toString()}>
                              {branch.name}
                            </Option>
                        ))}
                      </Select>
                  )}
              />
              <Button
                  color="error"
                  variant="contained"
                  onClick={() => setIsConfirmOpen(true)}
                  loading={isDeleting}
              >
                Удалить пользователя
              </Button>
            </Stack>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="text" onClick={onClose}>
              Отмена
            </Button>
            <Button
                color="primary"
                variant="contained"
                onClick={handleSubmit(onSubmit)}
                loading={isLoading}
            >
              Сохранить
            </Button>
          </DrawerFooter>
        </Drawer>

        <Dialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} size="s">
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Typography>Вы уверены, что хотите удалить этого пользователя?</Typography>
          </DialogBody>
          <DialogFooter>
            <Button variant="text" onClick={() => setIsConfirmOpen(false)}>
              Отмена
            </Button>
            <Button color="error" variant="contained" onClick={handleDeleteUser}>
              Удалить
            </Button>
          </DialogFooter>
        </Dialog>
      </>
  );
};

export default EditUserDialog;
