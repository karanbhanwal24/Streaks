import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

function MonthlyChart({ habits }) {
  if (!habits || habits.length === 0) {
    return <div className="text-center text-gray-500 py-8">No data available</div>
  }

  const data = habits.map(habit => ({
    name: habit.name,
    value: habit.percentage
  }))

  const COLORS = ['#1a1a1a', '#333333', '#4a4a4a', '#696969', '#808080', '#999999', '#b0b0b0', '#c0c0c0']

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default MonthlyChart
