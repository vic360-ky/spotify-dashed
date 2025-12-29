const StatsCards = ({ stats, timeUnit, onTimeUnitChange }) => {
  const formatValue = (value) => {
    return Math.floor(value);
  };

  return (
    <div className="bg-spotify-black border-2 border-spotify-green p-6 rounded-2xl">
      <div className="grid grid-cols-3 divide-x divide-spotify-green">
        {/* Total Time Card */}
        <div className="px-6">
          <p className="text-5xl font-bold text-white mb-4 text-center">
            {formatValue(stats.totalTime)}
          </p>
          
          <div className="flex justify-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="timeUnit"
                value="hours"
                checked={timeUnit === 'hours'}
                onChange={(e) => onTimeUnitChange(e.target.value)}
                className="w-4 h-4 accent-spotify-green"
              />
              <span className="text-sm text-white font-medium">Hours</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="timeUnit"
                value="minutes"
                checked={timeUnit === 'minutes'}
                onChange={(e) => onTimeUnitChange(e.target.value)}
                className="w-4 h-4 accent-spotify-green"
              />
              <span className="text-sm text-white font-medium">Minutes</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="timeUnit"
                value="seconds"
                checked={timeUnit === 'seconds'}
                onChange={(e) => onTimeUnitChange(e.target.value)}
                className="w-4 h-4 accent-spotify-green"
              />
              <span className="text-sm text-white font-medium">Seconds</span>
            </label>
          </div>
        </div>
        
        {/* Unique Artists Card */}
        <div className="px-6 text-center">
          <p className="text-5xl font-bold text-white mb-2">
            {stats.uniqueArtists.toLocaleString()}
          </p>
          <p className="text-white font-medium">Unique Artists</p>
        </div>
        
        {/* Unique Tracks Card */}
        <div className="px-6 text-center">
          <p className="text-5xl font-bold text-white mb-2">
            {stats.uniqueTracks.toLocaleString()}
          </p>
          <p className="text-white font-medium">Unique Tracks</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;