import { List } from '@ozen-ui/kit/List';
import clsx from 'clsx';

import s from './AccentList.module.css';

export const AccentList = ({ as, className, children, ...other }) => {
    return (
        <List
            as={as}
            className={clsx(s.accentList, className)}
            disablePadding
            {...other}
        >
            {children}
        </List>
    );
};
