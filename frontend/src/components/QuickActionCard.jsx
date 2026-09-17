import { Link } from 'react-router-dom'
import SectionCard from './SectionCard'

function QuickActionCard({ to, title, description, cta }) {
  return (
    <Link to={to}>
      <SectionCard className="card p-6 md:p-8 border hover:border-gray-400 transition-all group">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-gray-500 text-sm mb-4">{description}</p>
        </div>
        <div className="flex items-center gap-2 text-gray-900 font-medium text-sm">
          {cta}
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </SectionCard>
    </Link>
  )
}

export default QuickActionCard
