import { Stack } from '@ozen-ui/kit/Stack';
import './AppBarHeader.css';

export const AppBarHeader = ({ children, ...other }) => {
  return (
      <Stack className="AppBarHeader" gap="s" align="center" {...other}>
        {children}
      </Stack>
  );
};
