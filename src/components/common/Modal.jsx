
import React from 'react'
export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded shadow p-6 w-[90%] max-w-xl relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl">✖</button>
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  )
}
