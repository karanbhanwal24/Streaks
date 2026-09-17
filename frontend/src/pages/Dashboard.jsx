import { Link } from 'react-router-dom'
import { useHabits } from '../hooks/useHabits'
import { Plus } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import QuickActionCard from '../components/QuickActionCard'
import SectionCard from '../components/SectionCard'

function Dashboard() {
  const { habits } = useHabits()

  const today = new Date().toISOString().split('T')[0]

  const todayCompleted = habits.filter(habit => {
    const todayEntry = habit.tracking?.find(t => t.date === today)
    return todayEntry?.completed
  }).length

  const completionRate = habits.length > 0
    ? Math.round((todayCompleted / habits.length) * 100)
    : 0

  return (
    <PageLayout withNavbar>
      <PageHeader
        title="Dashboard"
        subtitle="Track your daily progress"
        className="mb-8"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <StatCard label="Total Habits" value={habits.length} />
        <StatCard label="Completed Today" value={todayCompleted} />
        <StatCard label="Today's Progress" value={`${completionRate}%`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <QuickActionCard
          to="/habits"
          title="Streaks"
          description="Track your daily habits with checkboxes"
          cta="Go to Habit Table"
        />
        <QuickActionCard
          to="/analysis"
          title="Analysis & Insights"
          description="View your progress and get personalized tips"
          cta="View Analysis"
        />
      </div>

      {habits.length === 0 && (
        <SectionCard className="mt-8 card p-8 border border-gray-300">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Plus className="text-gray-900" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Get Started!</h3>
              <p className="text-gray-600 text-sm mb-4">
                You haven't created any habits yet. Start building better habits today!
              </p>
              <Link to="/habits" className="btn-primary inline-flex items-center gap-2 text-sm py-2">
                <Plus size={16} />
                Create Your First Habit
              </Link>
            </div>
          </div>
        </SectionCard>
      )}
    </PageLayout>
  )
}

export default Dashboard
