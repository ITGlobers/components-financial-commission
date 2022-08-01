const now = new Date()

export const getDateString = (date: Date) => {
  const month = date.getMonth() + 1
  const monthString = month <= 9 ? `0${month}` : month
  const day = date.getDate()
  const dayString = day <= 9 ? `0${day}` : day

  return `${date.getFullYear()}-${monthString}-${dayString}`
}

export const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
now.setDate(now.getDate() - 1)
export const yesterday = now
export const today = new Date()
if (yesterday.getMonth() < today.getMonth() || yesterday.getMonth() < firstDay.getMonth()) {
  firstDay.setMonth(now.getMonth())
}

export const filterEmptyObj = (obj: any) => {
  Object.keys(obj).forEach(key => {
    if (obj[key] === '') {
      delete obj[key];
    }
  })
  return obj
}

export const filterSellerValues = (data: SellerSelect[], status: boolean) => {
  let stringId = '', countTotalItems = 0, sellerFilter = ''
  data.forEach((item: SellerSelect) => {
    stringId += status ? `${item.label},` : `${item.value.id},`
    sellerFilter += `${item.label},`
    countTotalItems += 1
  })

  return { stringId, sellerFilter, countTotalItems }
}
