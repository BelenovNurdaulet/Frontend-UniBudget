import { STATUS_VARIANTS } from './statusGroups'

export const getStatusColor = (statusId) => {
  const variant = Object.values(STATUS_VARIANTS).find(({ ids }) => ids.includes(statusId))

  return variant?.color || 'neutral'
}
