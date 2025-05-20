import { ROLES, ALL_ROLES } from '../../utils/roles'

export const HEADER_LINKS = [
  {
    text: 'Все заявки',
    href: '/issuances',
    roles: [ROLES.Administration,
    ROLES.HeadOfDepartment,
    ROLES.Finance],
  },

  { text: 'Мои заявки', href: '/my-issuances', roles: ALL_ROLES },
  { text: 'Завершенные заявки', href: '/my-issuances/completed',
    roles:
        [
          ROLES.RequestCreator,

        ]
  },
  {
    text: 'Создать заявку',
    href: '/create-request',
    roles: [
      ROLES.Administration,
      ROLES.RequestCreator,

    ],
  },
  {
    text: 'Список пользователей',
    href: '/users',
    roles: [ROLES.Administration],
  },
  {
    text: 'Создать период',
    href: '/create-period',
    roles: [ROLES.Administration],
  },
  {
    text: 'Периоды',
    href: '/periods',
    roles: [ROLES.Administration],
  },
  {
    text: 'Профиль',
    href: '/manage',
    roles: ALL_ROLES,
  },
]
