import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { TrendingUp } from 'lucide-react';
import { formatTimeWithUnit } from '../utils/exportUtils';

const ListeningOverTime = ({ data, timeUnit }) => {
  const [period, setPeriod] = useState('days'); // 'days', 'weeks', 'months'
  
  const formatXAxis = (dateStr) => {
    try {
      const date = new Date(dateStr);
      switch (period) {
        case 'weeks':
          return format(date, 'MMM d');
        case 'months':
          return format(date, 'MMM yyyy');
        case 'days':
        default:
          return format(date, 'MMM d');
      }
    } catch (e) {
      return dateStr;
    }
  };
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-spotify-gray p-3 rounded-lg border border-spotify-green">
          <p className="text-white font-medium">
            {formatXAxis(payload[0].payload.date)}
          </p>
          <p className="text-spotify-green font-bold">
            {formatTimeWithUnit(payload[0].value, timeUnit)}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-spotify-darkgray p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-spotify-green rounded-lg">
            <TrendingUp size={24} className="text-spotify-black" />
          </div>
          <h2 className="text-xl font-semibold text-white">Listening Over Time</h2>
        </div>
        
        <div className="flex bg-spotify-gray rounded-lg p-1">
          <button
            onClick={() => setPeriod('days')}
            className={`px-4 py-2 rounded-md transition-colors font-medium ${
              period === 'days'
                ? 'bg-spotify-green text-spotify-black'
                : 'text-spotify-lightgray hover:text-white'
            }`}
          >
            Days
          </button>
          <button
            onClick={() => setPeriod('weeks')}
            className={`px-4 py-2 rounded-md transition-colors font-medium ${
              period === 'weeks'
                ? 'bg-spotify-green text-spotify-black'
                : 'text-spotify-lightgray hover:text-white'
            }`}
          >
            Weeks
          </button>
          <button
            onClick={() => setPeriod('months')}
            className={`px-4 py-2 rounded-md transition-colors font-medium ${
              period === 'months'
                ? 'bg-spotify-green text-spotify-black'
                : 'text-spotify-lightgray hover:text-white'
            }`}
          >
            Months
          </button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#282828" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatXAxis}
            stroke="#B3B3B3"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#B3B3B3"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => value.toFixed(0)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="time" 
            stroke="#1ED760" 
            strokeWidth={2}
            dot={{ fill: '#1ED760', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ListeningOverTime;