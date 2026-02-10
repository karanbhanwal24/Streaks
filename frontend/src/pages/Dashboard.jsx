import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useHabits } from '../hooks/useHabits'
import { Table, BarChart3, TrendingUp, Target, Plus } from 'lucide-react'

function Dashboard() {
  const { habits, isLoading } = useHabits()

  const today = new Date().toISOString().split('T')[0]

  const todayCompleted = habits.filter(habit => {
    const todayEntry = habit.tracking?.find(t => t.date === today)
    return todayEntry?.completed
  }).length

  const completionRate = habits.length > 0
    ? Math.round((todayCompleted / habits.length) * 100)
    : 0

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
          <p className="text-gray-500 text-sm">Track your daily progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="card p-6 border">
            <p className="text-gray-500 text-sm mb-2">Total Habits</p>
            <p className="text-4xl font-bold text-gray-900">{habits.length}</p>
          </div>

          <div className="card p-6 border">
            <p className="text-gray-500 text-sm mb-2">Completed Today</p>
            <p className="text-4xl font-bold text-gray-900">{todayCompleted}</p>
          </div>

          <div className="card p-6 border">
            <p className="text-gray-500 text-sm mb-2">Today's Progress</p>
            <p className="text-4xl font-bold text-gray-900">{completionRate}%</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Link
            to="/habits"
            className="card p-6 md:p-8 border hover:border-gray-400 transition-all group"
          >
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Streaks</h3>
              <p className="text-gray-500 text-sm mb-4">Track your daily habits with checkboxes</p>
            </div>
            <div className="flex items-center gap-2 text-gray-900 font-medium text-sm">
              Go to Habit Table
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          <Link
            to="/analysis"
            className="card p-6 md:p-8 border hover:border-gray-400 transition-all group"
          >
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Analysis & Insights</h3>
              <p className="text-gray-500 text-sm mb-4">View your progress and get personalized tips</p>
            </div>
            <div className="flex items-center gap-2 text-gray-900 font-medium text-sm">
              View Analysis
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>

        {/* Quick Start Guide */}
        {habits.length === 0 && (
          <div className="mt-8 card p-8 border border-gray-300">
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
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
