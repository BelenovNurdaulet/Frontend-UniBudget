
import { ROLES } from '../roles'

export const REQUEST_STATUSES_CONFIG = {
  0: {
    name: 'Черновик',
    responsibleRole: null,
    actions: [
   //   { actionName: 'submit', label: 'Отправить на согласование', requireComment: false },
     // { actionName: 'cancel', label: 'Отменить', requireComment: true },

    ],


  },
  1: {
    name: 'Возвращена автору',
    responsibleRole: null,
    actions: [
     // { actionName: 'submit', label: 'Отправить на согласование', requireComment: false },
     // { actionName: 'cancel', label: 'Отменить', requireComment: true },

    ],
  },
  2: {
    name: 'На проверке руководителем',
    responsibleRole: ROLES.Executor,
    actions: [
      { actionName: 'accept', label: 'Принять в работу',    requireComment: false },
      { actionName: 'return', label: 'Вернуть на доработку', requireComment: true  },
      { actionName: 'cancel', label: 'Отменить',             requireComment: true  },
    ],
  },
  3: {
    name: 'Одобрена руководителем',
    responsibleRole: ROLES.Finance,
    actions: [
      { actionName: 'accept', label: 'Согласовать',          requireComment: false },
      { actionName: 'return', label: 'Вернуть на доработку', requireComment: true  },
      { actionName: 'cancel', label: 'Отменить',             requireComment: true  },
    ],
  },
  4: {
    name: 'Возвращена руководителю',
    responsibleRole: ROLES.Executor,
    actions: [
      { actionName: 'accept', label: 'Принять в работу',    requireComment: false },
      { actionName: 'return', label: 'Вернуть автору',       requireComment: true  },
      { actionName: 'cancel', label: 'Отменить',             requireComment: true  },
    ],
  },
  5: {
    name: 'Согласована финансистом',
    responsibleRole: null,    // финализированная — дальше ничего нельзя
    actions: [],
  },
  6: {
    name: 'Отменена',
    responsibleRole: null,    // отмена — концевой статус
    actions: [],
  },
}
