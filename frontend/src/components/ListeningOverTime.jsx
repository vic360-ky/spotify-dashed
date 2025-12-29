import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const ListeningOverTime = ({ data, timeUnit, timePeriod, onTimePeriodChange }) => {
  
  const formatXAxis = (dateStr) => {
    try {
      const date = new Date(dateStr);
      switch (timePeriod) {
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
        <div className="bg-spotify-darkgray p-3 rounded-lg border-2 border-spotify-green">
          <p className="text-white font-medium">
            {formatXAxis(payload[0].payload.date)}
          </p>
          <p className="text-spotify-green font-bold">
            {Math.floor(payload[0].value)} {timeUnit === 'hours' ? 'hours' : timeUnit === 'seconds' ? 'secs' : 'mins'}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-spotify-black border-2 border-spotify-green p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Listening Over Time</h2>
        
        <div className="flex gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="period"
              value="days"
              checked={timePeriod === 'days'}
              onChange={(e) => onTimePeriodChange(e.target.value)}
              className="w-4 h-4 accent-spotify-green"
            />
            <span className="text-sm text-white font-medium">Day</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="period"
              value="weeks"
              checked={timePeriod === 'weeks'}
              onChange={(e) => onTimePeriodChange(e.target.value)}
              className="w-4 h-4 accent-spotify-green"
            />
            <span className="text-sm text-white font-medium">Week</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="period"
              value="months"
              checked={timePeriod === 'months'}
              onChange={(e) => onTimePeriodChange(e.target.value)}
              className="w-4 h-4 accent-spotify-green"
            />
            <span className="text-sm text-white font-medium">Month</span>
          </label>
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
            tickFormatter={(value) => Math.floor(value)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="time" 
            stroke="#1ED760" 
            strokeWidth={2}
            dot={{ fill: '#1ED760', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ListeningOverTime;