import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
export default function getFormattedDate(dateString) {
  if (!dateString) return ''

  if (dateString.includes('Z')) {
    return dayjs.utc(dateString).format('DD.MM.YYYY HH:mm')
  } else {
    return dayjs(dateString).format('DD.MM.YYYY HH:mm')
  }
}
