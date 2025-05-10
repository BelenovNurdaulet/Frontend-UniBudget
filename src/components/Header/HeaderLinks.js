import { ROLES, ALL_ROLES } from '../../utils/roles'

export const HEADER_LINKS = [
  {
    text: 'Все заявки',
    href: '/issuances',
    roles: [ROLES.Administration],
  },
  {
    text: 'Завершенные заявки',
    href: '/issuances/completed',
    roles: [ROLES.Administration],
  },
  { text: 'Мои заявки', href: '/my-issuances', roles: ALL_ROLES },
  { text: 'Завершенные заявки', href: '/my-issuances/completed',
    roles:
        [
          ROLES.RequestCreator,
          ROLES.Executor,
        ]
  },
  {
    text: 'Создать заявку',
    href: '/create',
    roles: [
      ROLES.Administration,
      ROLES.RequestCreator,
      ROLES.Finance,
      ROLES.Executor,
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
