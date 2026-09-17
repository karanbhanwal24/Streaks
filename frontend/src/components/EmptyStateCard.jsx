import SectionCard from './SectionCard'

function EmptyStateCard({ icon, title, description, action, className = 'card p-12 text-center border' }) {
  return (
    <SectionCard className={className}>
      {icon}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      {action}
    </SectionCard>
  )
}

export default EmptyStateCard
