import React from 'react'

export default function FinancialCard({
  icon,
  label,
  value,
  additionalContent,
  borderColor = 'border-gray-100',
  bgColor = 'bg-white'
}) {
  return (
    <div className={`${bgColor} p-6 rounded-2xl shadow-sm border ${borderColor} transition-all duration-200 hover:shadow-md`}>
      
      {/* Top Header Label & Icon */}
      <div className="flex items-center justify-between text-sm font-medium text-gray-500 mb-2">
        <span>{label}</span>
        {icon && <div>{icon}</div>}
      </div>

      {/* Main Metric Value */}
      <div className="text-2xl font-bold text-gray-800 tracking-tight">
        {value}
      </div>

      {/* Additional Sub-content / Badges / Trends */}
      {additionalContent && (
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
          {additionalContent}
        </div>
      )}
    </div>
  )
}