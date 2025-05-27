import {
    UserCircleOutlineIcon,
    PowerOutlineIcon,
    RequestIcon,
    CalendarIcon, PlasticCardAddIcon, BookIcon,
} from '@ozen-ui/icons';

import AllRequestsTable from './features/request/AllRequestsTable.jsx';
import CreateRequest from './features/request/CreateRequest.jsx';
import CreatePeriod from './features/period/CreatePeriod.jsx';
import Periods from './features/period/Periods.jsx';
import UserProfile from './features/UserProfle/UserProfile.jsx';
import UsersList from './features/user/UsersList.jsx';
import PeriodInfo from "./features/period/periodInfo/PeriodInfo.jsx";
import EditPeriod from "./features/period/EditPeriod.jsx";
import RequestInfo from "./features/request/RequestInfo/RequestInfo.jsx";
import MyRequestsTable from "./features/request/MyRequestsTable.jsx";
import { ROLES, ALL_ROLES } from './utils/rolesConfig.jsx';
import EditRequest from "./features/request/EditRequest.jsx";
const routes = {
    'all-requests': {
        title: 'Все заявки',
        link: '/all-requests',
        path: '/all-requests',
        icon: BookIcon ,
        component: () => <AllRequestsTable />,
        roles: [ROLES.Administration, ROLES.Finance ],
    },
    'my-requests': {
        title: 'Мои заявки',
        link: '/my-requests',
        path: '/my-requests',
        icon: BookIcon ,
        component: () => <MyRequestsTable />,
        roles: ALL_ROLES,
    },

    'create-request': {
        title: 'Создать заявку',
        link: '/create-request',
        path: '/create-request',
        icon: RequestIcon,
        component: () => <CreateRequest />,
        roles: ALL_ROLES,
    },
    requestsInfo:{
        title: 'Информация о заявке',
        link: 'request/:id',
        path: 'request/:id',
        icon: RequestIcon,
        component: () => <RequestInfo />,
        roles: ALL_ROLES,
    },
    requestsEdit:{
        title: 'Редактирование заявки',
        link: 'edit-request/:id',
        path: 'edit-request/:id',
        icon: RequestIcon,
        component: () => <EditRequest/>,
        roles: ALL_ROLES,
    },


    'user-list': {
        title: 'Список пользователей',
        link: '/users',
        path: '/users',
        icon: UserCircleOutlineIcon,
        component: () => <UsersList />,
        roles: [ROLES.Administration, ROLES.Finance ],
    },
    'create-period': {
        title: 'Создать период',
        link: '/create-period',
        path: '/create-period',
        icon: PlasticCardAddIcon ,
        component: () => <CreatePeriod />,
        roles: [ROLES.Administration],
    },
    periods: {
        title: 'Периоды',
        link: '/periods',
        path: '/periods',
        icon: CalendarIcon ,
        component: () => <Periods />,
        roles: ALL_ROLES,
    },
    periodInfo: {
        title: 'Информация о периоде',
        link: '/periods/:id',
        path: '/periods/:id',
        icon: RequestIcon,
        component: () => <PeriodInfo />,
        roles: ALL_ROLES,
    },
    periodEdit: {
        title: 'Редактировать период',
        link: '/periods/:id/edit',
        path: '/periods/:id/edit',
        icon: RequestIcon,
        component: () => <EditPeriod />,
        roles:[ROLES.Administration],
    },
    profile: {
        title: 'Профиль',
        link: '/manage',
        path: '/manage',
        icon: UserCircleOutlineIcon,
        component: () => <UserProfile />,
        roles: ALL_ROLES,
    },
    logout: {
        title: 'Завершить сеанс',
        link: '/logout',
        path: '/logout',
        icon: PowerOutlineIcon,
        component: () => <div>Завершить сеанс</div>,
        roles: ALL_ROLES,
    },

};

export const navigation = {
    routes,
    apps: [
        'all-requests',
        'my-requests',
        'create-request',
        'create-period',
        'periods',
        'user-list',
        'logout',
    ],
};
