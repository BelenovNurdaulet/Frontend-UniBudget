import './AppBarHeaderLogo.css';

export const AppBarHeaderLogo = ({ children, ...other }) => {
  return (
      <div className="AppBarHeaderLogo" {...other}>
        {children}
      </div>
  );
};
