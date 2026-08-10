import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

export default function GaugeCard({ gauge, colorInfo, name, timeFrameLabel }) {
  const value = gauge?.value || 0
  const max = gauge?.max || 100
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const data = [
    { name: 'Completed', value: percentage },
    { name: 'Remaining', value: 100 - percentage },
  ]

  const COLORS = [colorInfo?.main || '#0d9488', '#f1f5f9']

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-between relative">
      <div className="w-full flex justify-between items-center mb-2">
        <h4 className="text-sm font-semibold text-gray-700 capitalize">{name}</h4>
        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{timeFrameLabel}</span>
      </div>

      <div className="w-full h-36 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="80%"
              startAngle={180}
              endAngle={0}
              innerRadius={55}
              outerRadius={75}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute bottom-2 text-center">
          <span className="text-xl font-bold text-gray-800">{Math.round(percentage)}%</span>
        </div>
      </div>

      <div className="w-full flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-50">
        <span>Current: ${value.toLocaleString()}</span>
        <span>Goal/Limit: ${max.toLocaleString()}</span>
      </div>
    </div>
  )
}