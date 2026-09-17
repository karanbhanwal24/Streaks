import { useState } from 'react'
import Navbar from '../components/Navbar'
import WeeklyChart from '../components/WeeklyChart'
import MonthlyChart from '../components/MonthlyChart'
import { useAnalysis } from '../hooks/useAnalysis'
import { useHabits } from '../hooks/useHabits'
import { BarChart3 } from 'lucide-react'
import LoadingScreen from '../components/LoadingScreen'
import PageLayout from '../components/PageLayout'
import PageHeader from '../components/PageHeader'
import SectionCard from '../components/SectionCard'
import EmptyStateCard from '../components/EmptyStateCard'
import AnalysisSummaryCard from '../components/AnalysisSummaryCard'
import SuggestionCard from '../components/SuggestionCard'
import { getApiUrl } from '../utils/api'

function Analysis() {
  const { autoAnalysis, autoLoading, useWeeklyAnalysis } = useAnalysis()
  const { habits } = useHabits()
  const [selectedHabitId, setSelectedHabitId] = useState(null)

  const { data: weeklyData } = useWeeklyAnalysis(selectedHabitId)

  if (autoLoading) {
    return (
      <LoadingScreen withNavbar navbar={<Navbar />} />
    )
  }

  return (
    <PageLayout withNavbar>
      <PageHeader
        title="Analysis & Insights"
        subtitle="Track your progress and get personalized recommendations"
        action={(
          <button
            onClick={() => {
              const token = localStorage.getItem('token')
              fetch(getApiUrl('/api/analysis/report') || '/api/analysis/report', {
                headers: { Authorization: `Bearer ${token}` }
              })
                .then(res => res.blob())
                .then(blob => {
                  const url = window.URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = 'habit-report.txt'
                  a.click()
                })
                .catch(err => console.error('Download failed', err));
            }}
            className="btn-primary flex items-center justify-center gap-2 text-sm py-2"
          >
            <BarChart3 size={18} />
            Download Report
          </button>
        )}
      />

      {autoAnalysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {autoAnalysis.mostFollowed && (
            <AnalysisSummaryCard
              title="Most Followed"
              icon={autoAnalysis.mostFollowed.icon}
              name={autoAnalysis.mostFollowed.name}
              percentage={autoAnalysis.mostFollowed.percentage}
            />
          )}

          {autoAnalysis.leastFollowed && (
            <AnalysisSummaryCard
              title="Needs Attention"
              icon={autoAnalysis.leastFollowed.icon}
              name={autoAnalysis.leastFollowed.name}
              percentage={autoAnalysis.leastFollowed.percentage}
            />
          )}

          <SectionCard>
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
          </SectionCard>
        </div>
      )}

      <SectionCard className="card p-6 mb-8 border">
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
      </SectionCard>

      {autoAnalysis?.allHabits && autoAnalysis.allHabits.length > 0 && (
        <SectionCard className="card p-6 mb-8 border">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Monthly Habit Distribution</h2>
          <p className="text-gray-500 text-sm mb-6">
            Completion percentage for all your habits this month
          </p>
          <MonthlyChart habits={autoAnalysis.allHabits} />
        </SectionCard>
      )}

      {autoAnalysis?.suggestions && autoAnalysis.suggestions.length > 0 && (
        <SectionCard>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Personalized Tips</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {autoAnalysis.suggestions.map((suggestion, index) => (
              <SuggestionCard
                key={index}
                index={index}
                suggestion={suggestion}
              />
            ))}
          </div>
        </SectionCard>
      )}

      {(!autoAnalysis || autoAnalysis.message) && (
        <EmptyStateCard
          icon={(
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="text-gray-400" size={40} />
            </div>
          )}
          title="No Analysis Available Yet"
          description={autoAnalysis?.message || 'Start tracking your habits to see insights and recommendations!'}
        />
      )}
    </PageLayout>
  )
}

export default Analysis
