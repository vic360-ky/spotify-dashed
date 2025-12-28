import { useState } from 'react';

const TimePeriodTable = ({ data, timeUnit }) => {
  const [mode, setMode] = useState('artist');
  
  const formatValue = (value) => {
    return Math.round(value);
  };
  
  return (
    <div className="bg-spotify-black border-2 border-spotify-green p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Time Period</h2>
        
        <div className="flex bg-spotify-darkgray rounded-lg p-1 border border-spotify-gray">
          <button
            onClick={() => setMode('artist')}
            className={`px-5 py-2 rounded-md transition-colors font-semibold ${
              mode === 'artist'
                ? 'bg-spotify-gray text-white'
                : 'text-spotify-lightgray hover:text-white'
            }`}
          >
            Artists
          </button>
          <button
            onClick={() => setMode('song')}
            className={`px-5 py-2 rounded-md transition-colors font-semibold ${
              mode === 'song'
                ? 'bg-spotify-gray text-white'
                : 'text-spotify-lightgray hover:text-white'
            }`}
          >
            Songs
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {data.map((row, index) => (
          <div 
            key={index}
            className="bg-spotify-darkgray p-4 rounded-lg border border-spotify-gray"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold mb-1">
                  {row.period}
                </p>
                <p className="text-spotify-lightgray text-sm truncate">
                  {row.item}
                </p>
              </div>
              <div className="text-right">
                <p className="text-spotify-green font-bold text-lg">
                  {mode === 'artist' 
                    ? `${formatValue(row.value)} ${timeUnit === 'hours' ? 'hours' : timeUnit === 'seconds' ? 'secs' : 'mins'}`
                    : `${row.value} plays`
                  }
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimePeriodTable;