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

const routes = {
    'all-issuances': {
        title: 'Все заявки',
        link: '/issuances',
        path: '/issuances',
        icon: Suitcase2Icon,
        component: () => <AllRequestsTable />,
    },
    'my-issuances': {
        title: 'Мои заявки',
        link: '/my-issuances',
        path: '/my-issuances',
        icon: RequestIcon,
        component: () => <MyIssuancesTable />,
    },
    'my-issuances-completed': {
        title: 'Завершенные заявки',
        link: '/my-issuances/completed',
        path: '/my-issuances/completed',
        icon: RequestIcon,
        component: () => <MyIssuancesTable />,
    },
    'create-request': {
        title: 'Создать заявку',
        link: '/create',
        path: '/create',
        icon: RequestIcon,
        component: () => <CreateRequest />,
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
        'all-issuances',
        ['my-issuances', 'my-issuances-completed'],
        'create-request',
        'user-list',
        'create-period',
        'periods',
        'profile',
        'logout',
    ],
};
