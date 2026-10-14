import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Stats() {
  const glucoseData = [
    { name: 'En rango', value: 72, color: '#00D4AA' },
    { name: 'Hipo', value: 10, color: '#FF4757' },
    { name: 'Hiper', value: 18, color: '#FFA502' },
  ]

  const carbsData = [
    { category: 'Desayuno', value: 45 },
    { category: 'Almuerzo', value: 65 },
    { category: 'Cena', value: 50 },
    { category: 'Snacks', value: 25 },
  ]

  const activityData = [
    { day: 'Lun', value: 45 },
    { day: 'Mar', value: 30 },
    { day: 'Mié', value: 60 },
    { day: 'Jue', value: 20 },
    { day: 'Vie', value: 50 },
    { day: 'Sáb', value: 70 },
    { day: 'Dom', value: 40 },
  ]

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Glucose Distribution */}
      <div className="bg-sc-surface rounded-sc-lg shadow-sc-subtle p-6">
        <h3 className="text-sm font-semibold text-sc-text-primary mb-4">Distribución Glucémica — 30 días</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={glucoseData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
            >
              {glucoseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center text-2xl font-bold text-sc-text-primary">72%</div>
        <div className="text-center text-xs text-sc-text-secondary">en rango</div>
      </div>

      {/* Carbs Distribution */}
      <div className="bg-sc-surface rounded-sc-lg shadow-sc-subtle p-6">
        <h3 className="text-sm font-semibold text-sc-text-primary mb-4">Carbohidratos por Comida</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={carbsData} layout="vertical">
            <CartesianGrid strokeDasharray="0" stroke="rgba(0,0,0,0.04)" />
            <XAxis type="number" stroke="#6B7280" style={{ fontSize: '12px' }} />
            <YAxis dataKey="category" type="category" stroke="#6B7280" style={{ fontSize: '12px' }} width={80} />
            <Tooltip />
            <Bar dataKey="value" fill="#00D4AA" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Activity */}
      <div className="bg-sc-surface rounded-sc-lg shadow-sc-subtle p-6">
        <h3 className="text-sm font-semibold text-sc-text-primary mb-4">Actividad Física (min/día)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="0" stroke="rgba(0,0,0,0.04)" vertical={false} />
            <XAxis dataKey="day" stroke="#6B7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
            <Tooltip />
            <Bar dataKey="value" fill="#00D4AA" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mood Distribution */}
      <div className="bg-sc-surface rounded-sc-lg shadow-sc-subtle p-6">
        <h3 className="text-sm font-semibold text-sc-text-primary mb-4">Estado de Ánimo</h3>
        <div className="space-y-3">
          {[
            { mood: '😊 Bien', percentage: 65 },
            { mood: '😐 Normal', percentage: 25 },
            { mood: '😟 Estresado', percentage: 10 },
          ].map((item) => (
            <div key={item.mood}>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-sc-text-primary">{item.mood}</span>
                <span className="text-sm font-semibold text-sc-text-primary">{item.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-sc-teal h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
