import React, { useState } from 'react'
import { Edit2, Trash2, Check, X, DollarSign } from 'lucide-react'

export default function TransactionItem({ transaction, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    description: transaction.description,
    amount: transaction.amount,
  })

  const handleSave = () => {
    if (!editForm.description || !editForm.amount) return
    onEdit(transaction._id || transaction.id, editForm)
    setIsEditing(false)
  }

  const isIncome = transaction.type === 'income'

  return (
    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50/50 transition">
      
      {/* Left Icon and Details */}
      <div className="flex items-center space-x-3 flex-1 min-w-0 pr-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isIncome ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
        }`}>
          <DollarSign className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-teal-500"
              />
              <input
                type="number"
                value={editForm.amount}
                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          ) : (
            <>
              <p className="font-semibold text-sm text-gray-800 truncate">{transaction.description}</p>
              <p className="text-xs text-gray-400 capitalize">
                {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Right Amount and Actions */}
      <div className="flex items-center space-x-4 flex-shrink-0">
        {!isEditing && (
          <span className={`font-bold text-sm ${isIncome ? 'text-green-600' : 'text-orange-600'}`}>
            {isIncome ? '+' : '-'}${Number(transaction.amount).toLocaleString()}
          </span>
        )}

        <div className="flex items-center space-x-1">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition"
                title="Save"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(transaction._id || transaction.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

    </div>
  )
}