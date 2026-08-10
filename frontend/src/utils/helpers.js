// src/utils/helpers.js

// Get the current time-frame range
export function getFrameRange(timeFrame) {
  const now = new Date();
  const start = new Date();

  switch (timeFrame) {
    case 'daily':
      start.setHours(0, 0, 0, 0);
      break;

    case 'weekly': {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);

      start.setDate(diff);
      start.setHours(0, 0, 0, 0);
      break;
    }

    case 'monthly':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;

    case 'yearly':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      break;

    default:
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
  }

  const labels = {
    daily: 'Today',
    weekly: 'This Week',
    monthly: 'This Month',
    yearly: 'This Year'
  };

  return {
    label: labels[timeFrame] || 'This Month',
    start,
    end: now
  };
}


// Get the previous time-frame range
export function getPreviousFrameRange(timeFrame) {
  const now = new Date();
  let start;
  let end;
  let label;

  switch (timeFrame) {
    case 'daily':
      start = new Date(now);
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);

      end = new Date(start);
      end.setHours(23, 59, 59, 999);

      label = 'Yesterday';
      break;

    case 'weekly':
      start = new Date(now);
      const day = start.getDay();
      const diff = day === 0 ? 6 : day - 1;

      // Start of current week
      start.setDate(start.getDate() - diff);

      // Start of previous week
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);

      end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);

      label = 'Previous Week';
      break;

    case 'monthly':
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      start.setHours(0, 0, 0, 0);

      end = new Date(now.getFullYear(), now.getMonth(), 0);
      end.setHours(23, 59, 59, 999);

      label = 'Previous Month';
      break;

    case 'yearly':
      start = new Date(now.getFullYear() - 1, 0, 1);
      start.setHours(0, 0, 0, 0);

      end = new Date(now.getFullYear() - 1, 11, 31);
      end.setHours(23, 59, 59, 999);

      label = 'Previous Year';
      break;

    default:
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      label = 'Previous Month';
  }

  return {
    label,
    start,
    end
  };
}


// Calculate basic financial data from transactions
export function calculateData(transactions = []) {
  if (!Array.isArray(transactions)) {
    return {
      income: 0,
      expense: 0,
      savings: 0
    };
  }

  let income = 0;
  let expense = 0;

  transactions.forEach((transaction) => {
    const amount = Number(transaction.amount) || 0;

    if (transaction.type === 'income') {
      income += amount;
    } else if (transaction.type === 'expense') {
      expense += amount;
    }
  });

  return {
    income,
    expense,
    savings: income - expense
  };
}