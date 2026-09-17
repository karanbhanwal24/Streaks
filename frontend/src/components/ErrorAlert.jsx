import { AlertCircle } from 'lucide-react'

function ErrorAlert({ message }) {
  if (!message) return null

  return (
    <div className="bg-gray-50 border border-gray-300 rounded p-4 flex items-start gap-3">
      <AlertCircle className="text-gray-600 flex-shrink-0 mt-0.5" size={20} />
      <p className="text-sm text-gray-700">{message}</p>
    </div>
  )
}

export default ErrorAlert
