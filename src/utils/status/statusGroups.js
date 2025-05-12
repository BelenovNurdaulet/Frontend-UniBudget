export const STATUS_VARIANTS = {
  WAITING: {
    color: 'warning',
    ids: [2, 5, 8, 10, 12, 14, 16, 18, 20, 31, 33],
  },
  IN_PROGRESS: {
    color: 'info',
    ids: [3, 4, 6, 7, 9, 11, 13, 15, 17, 19, 21, 27, 28, 32],
  },
  COMPLETED: {
    color: 'success',
    ids: [22],
  },
  REJECTED: {
    color: 'error',
    ids: [25],
  },
  RETURNED: {
    color: 'neutral',
    ids: [23, 24],
  },
  REASSIGNED: {
    color: 'info',
    ids: [26, 29, 30],
  },
}
