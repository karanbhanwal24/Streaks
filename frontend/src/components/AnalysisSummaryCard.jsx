import SectionCard from './SectionCard'

function AnalysisSummaryCard({ title, icon, name, percentage }) {
  return (
    <SectionCard>
      <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wide">{title}</h3>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{icon}</span>
        <p className="font-semibold text-gray-900">{name}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-3xl font-bold text-gray-900">{percentage}%</span>
        <span className="text-gray-500 text-sm">completion</span>
      </div>
    </SectionCard>
  )
}

export default AnalysisSummaryCard
