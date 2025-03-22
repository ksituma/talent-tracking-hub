
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface VacancyChartProps {
  data: Array<{
    month: string;
    applications: number;
    interviews: number;
    rejected: number;
  }>;
  className?: string;
}

export function VacancyChart({ data, className }: VacancyChartProps) {
  const [timeRange, setTimeRange] = React.useState<'daily' | 'weekly' | 'monthly'>('monthly');

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Vacancy Status</h3>
        <div className="flex items-center rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setTimeRange('daily')}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              timeRange === 'daily'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeRange('weekly')}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              timeRange === 'weekly'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeRange('monthly')}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              timeRange === 'monthly'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-6 mb-4">
        <LegendItem color="#4ADE80" label="Application" />
        <LegendItem color="#3B82F6" label="Interviews" />
        <LegendItem color="#F43F5E" label="Rejected" />
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="month" 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: 'none'
              }}
              itemStyle={{ padding: '2px 0', fontSize: '12px' }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="applications"
              fill="#4ADE80" 
              fillOpacity={0.1}
              stroke="#4ADE80" 
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Area 
              type="monotone" 
              dataKey="interviews" 
              fill="#3B82F6" 
              fillOpacity={0.1}
              stroke="#3B82F6" 
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Area 
              type="monotone" 
              dataKey="rejected" 
              fill="#F43F5E" 
              fillOpacity={0.1}
              stroke="#F43F5E" 
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center space-x-2">
      <div
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: color }}
      ></div>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );
}
