export function getStartDate(timeFrame) {
  const now = new Date()
  const start = new Date()

  switch (timeFrame) {
    case 'daily':
      start.setHours(0, 0, 0, 0)
      break
    case 'weekly':
      const day = now.getDay()
      const diff = now.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is Sunday
      start.setDate(diff)
      start.setHours(0, 0, 0, 0)
      break
    case 'monthly':
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      break
    case 'yearly':
      start.setMonth(0, 1)
      start.setHours(0, 0, 0, 0)
      break
    default:
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
  }
  return start
}

export function filterTransactionsByTimeFrame(transactions, timeFrame) {
  if (!transactions || !Array.isArray(transactions)) return []
  const startDate = getStartDate(timeFrame)

  return transactions.filter((tx) => {
    const txDate = new Date(tx.date)
    return txDate >= startDate
  })
}

export function getTimeFrameRange(timeFrame) {
  const now = new Date()
  let label = 'This Month'

  switch (timeFrame) {
    case 'daily':
      label = 'Today'
      break
    case 'weekly':
      label = 'This Week'
      break
    case 'monthly':
      label = 'This Month'
      break
    case 'yearly':
      label = 'This Year'
      break
    default:
      label = 'This Month'
  }

  return { label, start: getStartDate(timeFrame), end: now }
}