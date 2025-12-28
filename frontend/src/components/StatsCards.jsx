import { Clock, Mic, Music } from 'lucide-react';
import { formatTimeWithUnit } from '../utils/exportUtils';

const StatsCards = ({ stats, timeUnit, onTimeUnitChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Time Card */}
      <div className="bg-spotify-darkgray p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-spotify-green rounded-lg">
            <Clock size={24} className="text-spotify-black" />
          </div>
          <h3 className="text-lg font-semibold text-spotify-lightgray">Total Time</h3>
        </div>
        
        <p className="text-4xl font-bold text-white mb-4">
          {formatTimeWithUnit(stats.totalTime, timeUnit)}
        </p>
        
        <div className="flex gap-2">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="timeUnit"
              value="hours"
              checked={timeUnit === 'hours'}
              onChange={(e) => onTimeUnitChange(e.target.value)}
              className="accent-spotify-green"
            />
            <span className="text-sm text-spotify-lightgray">Hours</span>
          </label>
          
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="timeUnit"
              value="minutes"
              checked={timeUnit === 'minutes'}
              onChange={(e) => onTimeUnitChange(e.target.value)}
              className="accent-spotify-green"
            />
            <span className="text-sm text-spotify-lightgray">Minutes</span>
          </label>
          
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="timeUnit"
              value="seconds"
              checked={timeUnit === 'seconds'}
              onChange={(e) => onTimeUnitChange(e.target.value)}
              className="accent-spotify-green"
            />
            <span className="text-sm text-spotify-lightgray">Seconds</span>
          </label>
        </div>
      </div>
      
      {/* Unique Artists Card */}
      <div className="bg-spotify-darkgray p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-spotify-green rounded-lg">
            <Mic size={24} className="text-spotify-black" />
          </div>
          <h3 className="text-lg font-semibold text-spotify-lightgray">Unique Artists</h3>
        </div>
        
        <p className="text-4xl font-bold text-white">
          {stats.uniqueArtists.toLocaleString()}
        </p>
      </div>
      
      {/* Unique Tracks Card */}
      <div className="bg-spotify-darkgray p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-spotify-green rounded-lg">
            <Music size={24} className="text-spotify-black" />
          </div>
          <h3 className="text-lg font-semibold text-spotify-lightgray">Unique Tracks</h3>
        </div>
        
        <p className="text-4xl font-bold text-white">
          {stats.uniqueTracks.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default StatsCards;