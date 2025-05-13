import './AppBarFooter.css';

export const AppBarFooter = ({ children, ...other }) => {
    return (
        <div className="AppBarFooter" {...other}>
            {children}
        </div>
    );
};
