import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';

const ListeningClock = ({ data, timeUnit }) => {
  const chartData = data.map(item => ({
    hour: `${item.hour}:00`,
    time: item.time,
    percentage: item.percentage
  }));
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-spotify-darkgray p-3 rounded-lg border-2 border-spotify-green">
          <p className="text-white font-medium">
            {payload[0].payload.hour}
          </p>
          <p className="text-spotify-green font-bold">
            {Math.floor(payload[0].payload.time)} {timeUnit === 'hours' ? 'hours' : timeUnit === 'seconds' ? 'secs' : 'mins'}
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
    <div className="bg-spotify-black border-2 border-spotify-green p-6 rounded-2xl flex items-center justify-center">
      <ResponsiveContainer width="100%" height={500}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="#1ED760" strokeWidth={1} />
          <PolarAngleAxis 
            dataKey="hour" 
            stroke="#FFFFFF"
            style={{ fontSize: '14px', fontWeight: 'bold' }}
            tick={{ fill: '#FFFFFF' }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 'auto']}
            stroke="#1ED760"
            style={{ fontSize: '10px' }}
            tick={{ fill: '#B3B3B3' }}
          />
          <Radar 
            name="Listening Time" 
            dataKey="time" 
            stroke="#1ED760" 
            fill="#1ED760" 
            fillOpacity={0.5}
            strokeWidth={2}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ListeningClock;