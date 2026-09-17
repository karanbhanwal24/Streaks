import SectionCard from './SectionCard'

function StatCard({ label, value }) {
  return (
    <SectionCard>
      <p className="text-gray-500 text-sm mb-2">{label}</p>
      <p className="text-4xl font-bold text-gray-900">{value}</p>
    </SectionCard>
  )
}

export default StatCard
