import { useState } from 'react'
import Navbar from '../components/Navbar'
import WeeklyChart from '../components/WeeklyChart'
import MonthlyChart from '../components/MonthlyChart'
import { useAnalysis } from '../hooks/useAnalysis'
import { useHabits } from '../hooks/useHabits'
import { TrendingUp, TrendingDown, Lightbulb, Award, Target, BarChart3 } from 'lucide-react'

function Analysis() {
  const { autoAnalysis, autoLoading, useWeeklyAnalysis } = useAnalysis()
  const { habits } = useHabits()
  const [selectedHabitId, setSelectedHabitId] = useState(null)

  const { data: weeklyData } = useWeeklyAnalysis(selectedHabitId)

  if (autoLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-900 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Analysis & Insights</h1>
            <p className="text-gray-500 text-sm">Track your progress and get personalized recommendations</p>
          </div>
          <button
            onClick={() => {
              const token = localStorage.getItem('token');
              fetch('http://localhost:5001/api/analysis/report', {
                headers: { Authorization: `Bearer ${token}` }
              })
                .then(res => res.blob())
                .then(blob => {
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'habit-report.txt';
                  a.click();
                })
                .catch(err => console.error('Download failed', err));
            }}
            className="btn-primary flex items-center justify-center gap-2 text-sm py-2"
          >
            <BarChart3 size={18} />
            Download Report
          </button>
        </div>

        {/* Auto Analysis Cards */}
        {autoAnalysis && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            {/* Most Followed Habit */}
            {autoAnalysis.mostFollowed && (
              <div className="card p-6 border">
                <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wide">Most Followed</h3>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{autoAnalysis.mostFollowed.icon}</span>
                  <p className="font-semibold text-gray-900">{autoAnalysis.mostFollowed.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900">{autoAnalysis.mostFollowed.percentage}%</span>
                  <span className="text-gray-500 text-sm">completion</span>
                </div>
              </div>
            )}

            {/* Least Followed Habit */}
            {autoAnalysis.leastFollowed && (
              <div className="card p-6 border">
                <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wide">Needs Attention</h3>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{autoAnalysis.leastFollowed.icon}</span>
                  <p className="font-semibold text-gray-900">{autoAnalysis.leastFollowed.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900">{autoAnalysis.leastFollowed.percentage}%</span>
                  <span className="text-gray-500 text-sm">completion</span>
                </div>
              </div>
            )}

            {/* Overall Performance */}
            <div className="card p-6 border">
              <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wide">Overall</h3>
              <p className="text-sm text-gray-500 mb-2">Average Completion Rate</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">
                  {autoAnalysis.overallPercentage || 0}%
                </span>
              </div>
              <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gray-900 h-full rounded-full transition-all duration-500"
                  style={{ width: `${autoAnalysis.overallPercentage || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Weekly Progress Chart */}
        <div className="card p-6 mb-8 border">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Weekly Progress</h2>

          {habits.length > 0 ? (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Select Habit to Analyze
                </label>
                <select
                  value={selectedHabitId || ''}
                  onChange={(e) => setSelectedHabitId(e.target.value)}
                  className="input max-w-md"
                >
                  <option value="">Choose a habit...</option>
                  {habits.map(habit => (
                    <option key={habit._id} value={habit._id}>
                      {habit.icon} {habit.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedHabitId && weeklyData?.weeks ? (
                <div>
                  <p className="text-gray-600 mb-4">
                    Showing 4-week progress for: <span className="font-semibold">{weeklyData.habitName}</span>
                  </p>
                  <WeeklyChart data={weeklyData.weeks} />
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  Select a habit above to view weekly progress
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500 py-12">
              Create some habits first to see progress charts
            </div>
          )}
        </div>

        {/* Monthly Distribution */}
        {autoAnalysis?.allHabits && autoAnalysis.allHabits.length > 0 && (
          <div className="card p-6 mb-8 border">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Monthly Habit Distribution</h2>
            <p className="text-gray-500 text-sm mb-6">
              Completion percentage for all your habits this month
            </p>
            <MonthlyChart habits={autoAnalysis.allHabits} />
          </div>
        )}

        {/* Personalized Suggestions */}
        {autoAnalysis?.suggestions && autoAnalysis.suggestions.length > 0 && (
          <div className="card p-6 border">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Personalized Tips</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {autoAnalysis.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm">{suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!autoAnalysis || autoAnalysis.message) && (
          <div className="card p-12 text-center border">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="text-gray-400" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Analysis Available Yet</h3>
            <p className="text-gray-500 mb-6">
              {autoAnalysis?.message || 'Start tracking your habits to see insights and recommendations!'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Analysis
