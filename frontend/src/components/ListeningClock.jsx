import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Clock } from 'lucide-react';
import { formatTimeWithUnit } from '../utils/exportUtils';

const ListeningClock = ({ data, timeUnit }) => {
  // Format data for radar chart
  const chartData = data.map(item => ({
    hour: `${item.hour}:00`,
    time: item.time,
    percentage: item.percentage
  }));
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-spotify-gray p-3 rounded-lg border border-spotify-green">
          <p className="text-white font-medium">
            {payload[0].payload.hour}
          </p>
          <p className="text-spotify-green font-bold">
            {formatTimeWithUnit(payload[0].payload.time, timeUnit)}
          </p>
          <p className="text-spotify-lightgray text-sm">
            {payload[0].payload.percentage.toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-spotify-darkgray p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-spotify-green rounded-lg">
          <Clock size={24} className="text-spotify-black" />
        </div>
        <h2 className="text-xl font-semibold text-white">Listening Clock</h2>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="#282828" />
          <PolarAngleAxis 
            dataKey="hour" 
            stroke="#B3B3B3"
            style={{ fontSize: '12px' }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 'auto']}
            stroke="#B3B3B3"
            style={{ fontSize: '10px' }}
          />
          <Radar 
            name="Listening Time" 
            dataKey="time" 
            stroke="#1ED760" 
            fill="#1ED760" 
            fillOpacity={0.6}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ListeningClock;