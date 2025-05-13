import { Card } from '@ozen-ui/kit/Card';
import { Stack } from '@ozen-ui/kit/Stack';


import s from './LoginPage.module.css';
import {LoginPageHeader} from "./components/LoginPageHeader/LoginPageHeader.jsx";
import {LoginPageFooter} from "./components/LoginPageFooter/LoginPageFooter.jsx";
import {LoginPageBody} from "./components/LoginPageBody/LoginPageBody.jsx";

export const LoginPage = () => {
  return (
      <div className={s.login}>
        <div className={s.container}>
          <Card borderWidth="none" size="l" className={s.form}>
            <Stack direction="column" gap="xl" style={{ maxWidth: 420 }}>
              <LoginPageHeader />
              <LoginPageBody />
              <LoginPageFooter />
            </Stack>
          </Card>
        </div>
      </div>
  );
};
