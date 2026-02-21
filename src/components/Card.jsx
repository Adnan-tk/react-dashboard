import React from 'react'

export default function Card({ title, icon, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md">
      <div className="text-xl font-semibold mb-3 flex items-center gap-2">
        {icon}
        {title}
      </div>
      {children}
    </div>
  )
}
