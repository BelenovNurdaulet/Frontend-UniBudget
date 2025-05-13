import { Avatar } from '@ozen-ui/kit/Avatar';
import { Button } from '@ozen-ui/kit/ButtonNext';
import { Card } from '@ozen-ui/kit/Card';
import { Link } from '@ozen-ui/kit/Link';
import { List, ListItem, ListItemIcon, ListItemText } from '@ozen-ui/kit/List';
import { Stack } from '@ozen-ui/kit/Stack';
import { Typography } from '@ozen-ui/kit/Typography';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

import s from './LogoutPage.module.css';
import { clearUserData, selectUserData, setUserData } from '../UserProfle/userSlice';
import { useGetCurrentUserQuery } from '../UserProfle/userApi';

import { useSnackbar } from '@ozen-ui/kit/Snackbar';
import {logout} from "../auth/authSlice.js";

export const LogoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pushMessage } = useSnackbar();

  const user = useSelector(selectUserData);
  const { data: currentUser, isSuccess } = useGetCurrentUserQuery();

  useEffect(() => {
    if (isSuccess && currentUser) {
      dispatch(setUserData(currentUser));
    }
  }, [isSuccess, currentUser, dispatch]);

  const exit = () => {
    dispatch(logout());
    dispatch(clearUserData());
    pushMessage({
      title: 'Выход выполнен',
      description: 'Вы успешно вышли из системы.',
      status: 'success',
    });
    navigate('/login');
  };

  return (
      <div className={s.logout}>
        <div className={s.container}>
          <Card className={s.form} borderWidth="none" size="l">
            <Stack gap="2xl" direction="column" fullWidth>
              <Typography variant="heading-2xl">
                Хотите покинуть платформу?
              </Typography>
              <List disablePadding>
                <ListItem disableGutters>
                  <ListItemIcon>
                    <Avatar name={user?.userName} />
                  </ListItemIcon>
                  <ListItemText
                      primary={user?.userName}
                      secondary="Текущая сессия"
                      primaryTypographyProps={{ variant: 'text-l' }}
                      secondaryTypographyProps={{ variant: 'text-s' }}
                  />
                </ListItem>
              </List>
              <Button onClick={exit}>Выйти</Button>
              <Link component="button" align="center" onClick={() => navigate('/')}>
                Нет, я пока остаюсь на платформе
              </Link>
            </Stack>
          </Card>
        </div>
      </div>
  );
};
