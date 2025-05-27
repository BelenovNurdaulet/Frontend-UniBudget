import { Avatar } from '@ozen-ui/kit/Avatar';
import { ListItem, ListItemIcon, ListItemText } from '@ozen-ui/kit/List';
import { useDispatch, useSelector } from 'react-redux';
import { AccentList } from '../AccentList/AccentList.jsx';
import { selectUserData, setUserData } from '../../features/UserProfle/userSlice.js';
import { useEffect } from 'react';
import { useGetCurrentUserQuery } from '../../features/UserProfle/userApi.js';
import { useGetReferenceQuery } from '../../features/reference/referenceApi';

export const Profile = () => {
    const user = useSelector(selectUserData);
    const { data: currentUser, isSuccess } = useGetCurrentUserQuery();
    const { data: referenceData } = useGetReferenceQuery();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isSuccess && currentUser) {
            dispatch(setUserData(currentUser));
        }
    }, [isSuccess, currentUser, dispatch]);

    if (!user) return null;

    const branchName = referenceData?.valueOrDefault?.branches?.find(
        (branch) => branch.id === user.branchId
    )?.name;

    return (
        <AccentList>
            <ListItem disableGutters>
                <ListItemIcon>
                    <Avatar
                        size="xs"
                        name={user.userName}
                        // Если будет поле с URL аватарки — добавь src={user.avatarUrl}
                    />
                </ListItemIcon>
                <ListItemText
                    primary={user.userName}
                    secondary={branchName || `Филиал №${user.branchId}`}
                    primaryTypographyProps={{
                        noWrap: true,
                        color: 'accentPrimary',
                    }}
                    secondaryTypographyProps={{noWrap: true}}
                />
            </ListItem>
        </AccentList>
    );
};
