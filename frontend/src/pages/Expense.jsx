import React, { useState, useEffect } from 'react'
import { Plus, Download, TrendingDown } from 'lucide-react'
import axios from 'axios'
import { exportToExcel } from '../utils/excelExport'

export function Expense() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchExpense = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      const response = await axios.get('http://localhost:4000/api/expense/get', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setExpenses(response.data)
    } catch (err) {
      console.error('Failed to load expense data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpense()
  }, [])

  const handleExport = () => {
    exportToExcel(expenses, 'expense_details')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500 font-medium">
        Loading expense records...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header & Export Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Expense Management</h1>
          <p className="text-sm text-gray-500">Monitor your outgoing spend categories and download logs.</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl font-medium text-sm shadow-sm transition"
        >
          <Download className="w-4 h-4 text-gray-500" />
          <span>Export Excel</span>
        </button>
      </div>

      {/* Expense Records List Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">All Expense Transactions</h3>

        {expenses.length === 0 ? (
          <p className="text-sm text-gray-400 py-12 text-center">No expense records added yet.</p>
        ) : (
          <div className="space-y-3">
            {expenses.map((exp) => (
              <div 
                key={exp._id || exp.id} 
                className="flex items-center justify-between p-4 border border-gray-50 rounded-xl hover:bg-gray-50 transition"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{exp.description}</p>
                    <p className="text-xs text-gray-400 capitalize">
                      {exp.category} • {new Date(exp.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-orange-600 text-sm">
                  -${Number(exp.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Expense;