import { useState } from 'react'
import DayCheckbox from '../components/DayCheckbox'
import { useHabits } from '../hooks/useHabits'
import { Plus, Trash2, X, Check } from 'lucide-react'
import Navbar from '../components/Navbar'
import LoadingScreen from '../components/LoadingScreen'
import PageLayout from '../components/PageLayout'
import PageHeader from '../components/PageHeader'
import SectionCard from '../components/SectionCard'
import LegendItem from '../components/LegendItem'
import AddHabitForm from '../components/AddHabitForm'
import HabitMobileCard from '../components/HabitMobileCard'

function HabitTable() {
  const { habits, isLoading, createHabit, deleteHabit, trackHabit } = useHabits()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newHabitName, setNewHabitName] = useState('')
  const [newHabitIcon, setNewHabitIcon] = useState('📝')

  // Get current month dates
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const dates = []
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    dates.push({
      day,
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dateString: date.toISOString().split('T')[0]
    })
  }

  const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const handleAddHabit = async (e) => {
    e.preventDefault()
    if (!newHabitName.trim()) return

    await createHabit.mutateAsync({
      name: newHabitName,
      icon: newHabitIcon
    })

    setNewHabitName('')
    setNewHabitIcon('📝')
    setShowAddForm(false)
  }

  const handleDeleteHabit = async (id) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      await deleteHabit.mutateAsync(id)
    }
  }

  const handleToggleTracking = async (habitId, date) => {
    await trackHabit.mutateAsync({ id: habitId, date })
  }

  if (isLoading) {
    return (
      <LoadingScreen withNavbar navbar={<Navbar />} />
    )
  }

  return (
    <PageLayout withNavbar containerClassName="max-w-full px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Streaks"
        subtitle={monthName}
        className="mb-6 flex items-center justify-between"
        action={(
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary flex items-center gap-2 text-sm py-2"
          >
            {showAddForm ? <X size={16} /> : <Plus size={16} />}
            {showAddForm ? 'Cancel' : 'Add Habit'}
          </button>
        )}
      />

      {showAddForm && (
        <SectionCard className="card p-6 mb-6 border">
          <AddHabitForm
            newHabitIcon={newHabitIcon}
            newHabitName={newHabitName}
            onIconChange={setNewHabitIcon}
            onNameChange={setNewHabitName}
            onSubmit={handleAddHabit}
          />
        </SectionCard>
      )}

      <div className="hidden md:block card border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-300">
                <th className="table-cell font-semibold text-gray-700 w-16 sticky left-0 bg-white z-10">
                  Icon
                </th>
                <th className="table-cell font-semibold text-gray-700 text-left min-w-[200px] sticky left-16 bg-white z-10">
                  Habit Name
                </th>
                {dates.map((date) => (
                  <th
                    key={date.dateString}
                    className={`table-cell font-medium text-xs ${date.dateString === today.toISOString().split('T')[0]
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div>{date.weekday}</div>
                      <div className="font-bold">{date.day}</div>
                    </div>
                  </th>
                ))}
                <th className="table-cell font-semibold text-gray-700 w-16 sticky right-0 bg-white z-10">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {habits.length === 0 ? (
                <tr>
                  <td colSpan={dates.length + 3} className="table-cell text-center py-12 text-gray-500">
                    No habits yet. Click "Add Habit" to get started!
                  </td>
                </tr>
              ) : (
                habits.map((habit) => (
                  <tr key={habit._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="table-cell text-center text-2xl sticky left-0 bg-white z-10">
                      {habit.icon}
                    </td>
                    <td className="table-cell font-medium sticky left-16 bg-white z-10">
                      {habit.name}
                    </td>
                    {dates.map((date) => (
                      <DayCheckbox
                        key={date.dateString}
                        habit={habit}
                        date={date.dateString}
                        onToggle={handleToggleTracking}
                      />
                    ))}
                    <td className="table-cell text-center sticky right-0 bg-white z-10">
                      <button
                        onClick={() => handleDeleteHabit(habit._id)}
                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors"
                        title="Delete habit"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-4 pb-20">
        {habits.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No habits yet. Tap "Add Habit" to start!
          </div>
        ) : (
          habits.map((habit) => {
            const todayDate = new Date().toISOString().split('T')[0]
            const isCompletedToday = habit.tracking?.find(t => t.date === todayDate)?.completed

            return (
              <HabitMobileCard
                key={habit._id}
                habit={habit}
                todayDate={todayDate}
                isCompletedToday={isCompletedToday}
                onToggle={handleToggleTracking}
                onDelete={handleDeleteHabit}
              />
            )
          })
        )}
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-600">
        <LegendItem
          icon={<div className="w-6 h-6 rounded border-2 border-gray-300 bg-white"></div>}
          label="Not completed"
        />
        <LegendItem
          icon={(
            <div className="w-6 h-6 rounded border-2 border-green-600 bg-green-500 flex items-center justify-center">
              <Check className="text-white" size={16} strokeWidth={3} />
            </div>
          )}
          label="Completed"
        />
      </div>
    </PageLayout>
  )
}

export default HabitTable
