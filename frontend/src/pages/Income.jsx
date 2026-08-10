import React, { useState, useEffect } from 'react'
import { Plus, Download, TrendingUp } from 'lucide-react'
import axios from 'axios'
import { exportToExcel } from '../utils/excelExport'

export function Income() {
  const [incomes, setIncomes] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchIncome = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      const response = await axios.get('http://localhost:4000/api/income/get', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setIncomes(response.data)
    } catch (err) {
      console.error('Failed to load income data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncome()
  }, [])

  const handleExport = () => {
    exportToExcel(incomes, 'income_details')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500 font-medium">
        Loading income records...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header & Export Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Income Management</h1>
          <p className="text-sm text-gray-500">View, track, and export your personal income history.</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl font-medium text-sm shadow-sm transition"
        >
          <Download className="w-4 h-4 text-gray-500" />
          <span>Export Excel</span>
        </button>
      </div>

      {/* Income Records List Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">All Income Transactions</h3>

        {incomes.length === 0 ? (
          <p className="text-sm text-gray-400 py-12 text-center">No income records added yet.</p>
        ) : (
          <div className="space-y-3">
            {incomes.map((inc) => (
              <div 
                key={inc._id || inc.id} 
                className="flex items-center justify-between p-4 border border-gray-50 rounded-xl hover:bg-gray-50 transition"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{inc.description}</p>
                    <p className="text-xs text-gray-400 capitalize">
                      {inc.category} • {new Date(inc.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-green-600 text-sm">
                  +${Number(inc.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Income;