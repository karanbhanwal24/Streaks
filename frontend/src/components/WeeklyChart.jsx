import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

function WeeklyChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500 py-8">No data available</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="weekLabel"
          tick={{ fill: '#6b7280', fontSize: 12 }}
        />
        <YAxis
          tick={{ fill: '#6b7280', fontSize: 12 }}
          label={{ value: 'Completion %', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
          formatter={(value) => `${value}%`}
        />
        <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill="#1a1a1a"
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default WeeklyChart
