import * as XLSX from 'xlsx'

export const exportToExcel = (data, fileName = 'transactions') => {
  if (!data || data.length === 0) {
    alert('No data available to export!')
    return
  }

  try {
    // Map data to cleaner columns for the Excel sheet
    const formattedData = data.map((item) => ({
      Description: item.description,
      Amount: item.amount,
      Category: item.category,
      Date: new Date(item.date).toLocaleDateString(),
      Type: item.type || 'Transaction'
    }))

    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const workbook = XLSX.utils.book_new()
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    XLSX.writeFile(workbook, `${fileName}.xlsx`)
  } catch (error) {
    console.error('Excel export error:', error)
    alert('Error exporting data to Excel. Please try again.')
  }
}