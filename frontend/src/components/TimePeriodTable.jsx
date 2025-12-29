import { useState } from 'react';

const TimePeriodTable = ({ dataArtists, dataSongs, timeUnit }) => {
  const [mode, setMode] = useState('artist');
  
  const data = mode === 'artist' ? dataArtists : dataSongs;
  
  const formatValue = (value) => {
    return Math.floor(value);
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
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <p className="text-white font-semibold text-lg whitespace-nowrap">
                  {row.period}
                </p>
                <p className="text-white text-lg font-medium truncate">
                  {row.item}
                </p>
              </div>
              <div className="text-right">
                <p className="text-spotify-green font-bold text-lg whitespace-nowrap">
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