import { Card } from '@ozen-ui/kit/Card';
import { Stack } from '@ozen-ui/kit/Stack';


import s from './RegistrationPage.module.css';
import {RegistrationPageHeader} from "./components/RegistrationPageHeader/RegistrationPageHeader.jsx";
import {RegistrationPageFooter} from "./components/RegistrationPageFooter/RegistrationPageFooter.jsx";
import {RegistrationPageBody} from "./components/RegistrationPageBody/RegistrationPageBody.jsx";

export const RegistrationPage = () => {
  return (
      <div className={s.login}>
        <div className={s.container}>
          <Card borderWidth="none" size="l" className={s.form}>
            <Stack direction="column" gap="xl" style={{ maxWidth: 420 }}>
              <RegistrationPageHeader />
              <RegistrationPageBody />
              <RegistrationPageFooter />
            </Stack>
          </Card>
        </div>
      </div>
  );
};
