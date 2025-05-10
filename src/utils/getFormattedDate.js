import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
export default function getFormattedDate(dateString) {
  if (!dateString) return ''

  if (dateString.includes('Z')) {
    // For UTC dates, parse as UTC
    return dayjs.utc(dateString).format('DD.MM.YYYY HH:mm')
  } else {
    // For dates with timezone offset
    return dayjs(dateString).format('DD.MM.YYYY HH:mm')
  }
}
