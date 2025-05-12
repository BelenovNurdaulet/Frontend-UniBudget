import { Tag } from '@ozen-ui/kit/TagNext'
import { getStatusColor } from './statusUtils'

export const StatusTag = ({ statusId, statusName }) => {
  const color = getStatusColor(statusId)

  return <Tag color={color} label={statusName} size="s" />
}
