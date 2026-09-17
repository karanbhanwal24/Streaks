import { Trash2 } from 'lucide-react'
import DayCheckbox from './DayCheckbox'

function HabitMobileCard({ habit, todayDate, isCompletedToday, onToggle, onDelete }) {
  return (
    <div className="card p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl">
          {habit.icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{habit.name}</h3>
          <p className="text-xs text-gray-500">
            {isCompletedToday ? 'Completed today' : 'Not completed yet'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <DayCheckbox
          habit={habit}
          date={todayDate}
          onToggle={onToggle}
        />
        <button
          onClick={() => onDelete(habit._id)}
          className="text-gray-400 hover:text-red-600 p-2"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}

export default HabitMobileCard
