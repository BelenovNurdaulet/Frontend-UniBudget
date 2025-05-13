import {
    DashboardIcon,
    UserCircleOutlineIcon,
    PowerOutlineIcon,
    RequestIcon,
    Suitcase2Icon,
} from '@ozen-ui/icons';

import AllRequestsTable from './features/request/AllRequestsTable.jsx';
import MyIssuancesTable from './features/Issuance/MyIssuancesTable.jsx';
import CreateRequest from './features/request/CreateRequest.jsx';
import CreatePeriod from './features/period/CreatePeriod.jsx';
import Periods from './features/period/Periods.jsx';
import UserProfile from './features/UserProfle/UserProfile.jsx';
import UsersList from './features/Users/UsersList.jsx';
import PeriodInfo from "./features/period/periodInfo/PeriodInfo.jsx";
import EditPeriod from "./features/period/EditPeriod.jsx";
import RequestInfo from "./features/request/RequestInfo/RequestInfo.jsx";

const routes = {
    'all-requests': {
        title: 'Все заявки',
        link: '/all-requests',
        path: '/all-requests',
        icon: Suitcase2Icon,
        component: () => <AllRequestsTable />,
    },
    'my-requests': {
        title: 'Мои заявки',
        link: '/my-requests',
        path: '/my-requests',
        icon: RequestIcon,
        component: () => <MyIssuancesTable />,
    },

    'create-request': {
        title: 'Создать заявку',
        link: 'period/create',
        path: 'period/create',
        icon: RequestIcon,
        component: () => <CreateRequest />,
    },
    requestsInfo:{
        title: 'Информация о заявке',
        link: 'request/:id',
        path: 'request/:id',
        icon: RequestIcon,
        component: () => <RequestInfo />,
    },


    'user-list': {
        title: 'Список пользователей',
        link: '/users',
        path: '/users',
        icon: UserCircleOutlineIcon,
        component: () => <UsersList />,
    },
    'create-period': {
        title: 'Создать период',
        link: '/create-period',
        path: '/create-period',
        icon: RequestIcon,
        component: () => <CreatePeriod />,
    },
    periods: {
        title: 'Периоды',
        link: '/periods',
        path: '/periods',
        icon: DashboardIcon,
        component: () => <Periods />,
    },
    periodInfo: {
        title: 'Информация о периоде',
        link: '/periods/:id',
        path: '/periods/:id',
        icon: RequestIcon,
        component: () => <PeriodInfo />,
    },
    periodEdit: {
        title: 'Редактировать период',
        link: '/periods/:id/edit',
        path: '/periods/:id/edit',
        icon: RequestIcon,
        component: () => <EditPeriod />,
    },
    profile: {
        title: 'Профиль',
        link: '/manage',
        path: '/manage',
        icon: UserCircleOutlineIcon,
        component: () => <UserProfile />,
    },
    logout: {
        title: 'Завершить сеанс',
        link: '/logout',
        path: '/logout',
        icon: PowerOutlineIcon,
        component: () => <div>Завершить сеанс</div>, // заглушка
    },

};

export const navigation = {
    routes,
    apps: [
        'all-requests',
        'my-requests',
        'create-request',
        'user-list',
        'create-period',
        'periods',
        'profile',
        'logout',
    ],
};
