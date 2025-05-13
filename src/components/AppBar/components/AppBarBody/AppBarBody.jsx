import './AppBarBody.css';

export const AppBarBody = ({ children, ...other }) => {
  return (
      <div className="AppBarBody" {...other}>
        {children}
      </div>
  );
};
