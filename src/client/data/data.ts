export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
]

export const taskStatuses = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: 'tabler:question-circle',
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: 'tabler:circle',
  },
  {
    value: 'in progress',
    label: 'In Progress',
    icon: 'tabler:stopwatch',
  },
  {
    value: 'done',
    label: 'Done',
    icon: 'tabler:circle-check',
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: 'tabler:circle-minus',
  },
]

export const organizationStatuses = [
  {
    value: 'default',
    label: 'Без статуса',
    icon: 'tabler:question-circle',
  },
  {
    value: 'in_progress',
    label: 'В работе',
    icon: 'tabler:progress',
  },
  {
    value: 'moderation',
    label: 'Модерация',
    icon: 'tabler:file-search',
  },
  {
    value: 'moderation_success',
    label: 'Проверено',
    icon: 'tabler:progress-check',
  },
  {
    value: 'accepted_district',
    label: 'В списке ОИВ/ОМСУ',
    icon: 'tabler:map-pin-check'
  },
  {
    value: 'accepted_subject',
    label: 'В списке за субъект',
    icon: 'tabler:map-check'
  },
  {
    value: 'rejected',
    label: 'Отказано',
    icon: 'tabler:progress-x',
  },
]

export const userStatuses = [
  {
    value: 'default',
    label: 'Без статуса',
    icon: 'tabler:question-circle',
  },
  {
    value: 'blocked',
    label: 'Заблокирован',
    icon: 'tabler:progress-x',
  },
  {
    value: 'active',
    label: 'Модерация',
    icon: 'tabler:progress-check',
  },
]


export const priorities = [
  {
    value: 'low',
    label: 'Low',
    icon: 'tabler:chevrons-down',
  },
  {
    value: 'medium',
    label: 'Medium',
    icon: 'tabler:chevrons-right',
  },
  {
    value: 'high',
    label: 'High',
    icon: 'tabler:chevrons-up',
  },
]