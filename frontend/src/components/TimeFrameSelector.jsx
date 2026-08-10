import React from 'react'

export default function TimeFrameSelector({ timeFrame, setTimeFrame }) {
  const frames = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'yearly', label: 'Yearly' },
  ]

  return (
    <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
      {frames.map((frame) => {
        const isActive = timeFrame === frame.id
        return (
          <button
            key={frame.id}
            onClick={() => setTimeFrame(frame.id)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isActive 
                ? 'bg-white text-teal-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {frame.label}
          </button>
        )
      })}
    </div>
  )
}