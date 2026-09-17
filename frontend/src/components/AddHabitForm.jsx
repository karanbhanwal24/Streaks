function AddHabitForm({
  newHabitIcon,
  newHabitName,
  onIconChange,
  onNameChange,
  onSubmit
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-4">
      <div className="flex-shrink-0">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Icon
        </label>
        <input
          type="text"
          value={newHabitIcon}
          onChange={(e) => onIconChange(e.target.value)}
          className="input w-20 text-center text-2xl"
          maxLength={2}
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Habit Name
        </label>
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => onNameChange(e.target.value)}
          className="input"
          placeholder="e.g., Morning meditation, Read 30 minutes"
          autoFocus
        />
      </div>
      <div className="flex items-end">
        <button
          type="submit"
          className="btn-primary whitespace-nowrap"
          disabled={!newHabitName.trim()}
        >
          Add Habit
        </button>
      </div>
    </form>
  )
}

export default AddHabitForm
