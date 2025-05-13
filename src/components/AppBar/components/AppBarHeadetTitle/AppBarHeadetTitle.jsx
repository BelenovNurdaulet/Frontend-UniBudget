import { Typography } from '@ozen-ui/kit/Typography';

export const AppBarHeaderTitle = ({ children, ...other }) => {
  return (
      <Typography variant="text-m_1" color="accentPrimary" noWrap {...other}>
        {children}
      </Typography>
  );
};
