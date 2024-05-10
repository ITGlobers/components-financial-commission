type StatusOptions = {
  [key: string]: {
    bgColor: string
    fontColor: string
  }
}

export const status: StatusOptions = {
  'waiting-for-sellers-confirmation': {
    bgColor: '#134CD8',
    fontColor: '#FFF',
  },
  'payment-pending': {
    bgColor: '#134CD8',
    fontColor: '#FFF',
  },
  'payment-approved': {
    bgColor: '#8BC34A',
    fontColor: '#FFF',
  },
  'ready-for-handling': {
    bgColor: '#134CD8',
    fontColor: '#FFF',
  },
  handling: {
    bgColor: '#134CD8',
    fontColor: '#FFF',
  },
  invoiced: {
    bgColor: '#134CD8',
    fontColor: '#FFF',
  },
  canceled: {
    bgColor: '#FF4C4C',
    fontColor: '#FFF',
  },
}

const formatDate = (valueDate: number) => {
  const validateDate = valueDate <= 9 ? `0${valueDate}` : valueDate

  return validateDate
}

const defaultDate = new Date()
let defaultStart: Date = new Date()
const defaultfinal = new Date(
  defaultDate.getFullYear(),
  defaultDate.getMonth(),
  defaultDate.getDate()
)

export const defaultFinalString = `${defaultfinal.getFullYear()}-${formatDate(
  defaultfinal.getMonth() + 1
)}-${formatDate(defaultfinal.getDate())}`

if (defaultDate.getDate() <= 1) {
  defaultStart = defaultfinal
} else {
  defaultStart = new Date(defaultDate.getFullYear(), defaultDate.getMonth(), 1)
}

export const defaultStartString = `${defaultStart.getFullYear()}-${formatDate(
  defaultStart.getMonth() + 1
)}-${formatDate(defaultStart.getDate())}`
