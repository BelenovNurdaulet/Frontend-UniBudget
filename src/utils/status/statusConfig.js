
import { ROLES } from '../roles'

export const REQUEST_STATUSES_CONFIG = {
  Created: {
    name: 'Заявка создана',
    responsibleRole: ROLES.RequestCreator,
    actions: [

    ],


  },
  ReturnToCreator: {
    name: 'Возвращена на доработку',
    responsibleRole: null,
    actions: [
     // { actionName: 'submit', label: 'Отправить на согласование', requireComment: false },
     // { actionName: 'cancel', label: 'Отменить', requireComment: true },

    ],
  },
  InReview: {
    name: 'На соглосовании руководителем',
    responsibleRole: ROLES.HeadOfDepartment,
    actions: [
      { actionName: 'approve', label: 'Принять в работу',    requireComment: false },
      { actionName: 'return', label: 'Вернуть на доработку', requireComment: true  },
      { actionName: 'cancel', label: 'Отменить',             requireComment: true  },
    ],
  },
  Approved: {
    name: 'На соглосовании финансовым отделом',
    responsibleRole: ROLES.Finance,
    actions: [
      { actionName: 'approve', label: 'Согласовать',          requireComment: false },
      { actionName: 'return', label: 'Вернуть на доработку', requireComment: true  },
      { actionName: 'cancel', label: 'Отменить',             requireComment: true  },
    ],
  },
  ReturnToReviewer: {
    name: 'Возвращена на доработку руководителю',
    responsibleRole: ROLES.HeadOfDepartment,
    actions: [
      { actionName: 'approve', label: 'Принять в работу',    requireComment: false },
      { actionName: 'return', label: 'Вернуть автору',       requireComment: true  },
      { actionName: 'cancel', label: 'Отменить',             requireComment: true  },
    ],
  },
  Submitted: {
    name: 'Соглосована',
    responsibleRole: null,    // финализированная — дальше ничего нельзя
    actions: [],
  },
  Cancelled: {
    name: 'Отменена',
    responsibleRole: null,    // отмена — концевой статус
    actions: [],
  },
}
