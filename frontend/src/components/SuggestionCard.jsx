function SuggestionCard({ index, suggestion }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-white font-bold text-sm">{index + 1}</span>
        </div>
        <p className="text-gray-700 leading-relaxed text-sm">{suggestion}</p>
      </div>
    </div>
  )
}

export default SuggestionCard
