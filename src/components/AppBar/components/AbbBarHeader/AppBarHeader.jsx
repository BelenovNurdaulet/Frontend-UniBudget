import { Stack } from '@ozen-ui/kit/Stack';
import './AppBarHeader.css';
import logo from '../../../../assets/logo.svg';

const AppBarHeader = () => {
    return (
        <Stack className="AppBarHeader" align="center" >
            <img
                src={logo}
                alt="Logo"
                style={{ height: '64px' }}
                align="center"
            />
        </Stack>
    );
};

export default AppBarHeader;