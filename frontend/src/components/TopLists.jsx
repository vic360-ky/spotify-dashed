import { useState } from 'react';

const TopLists = ({ topArtists, topTracks, timeUnit, activeFilter, onItemClick }) => {
  const [mode, setMode] = useState('artists');
  
  const data = mode === 'artists' ? topArtists : topTracks;
  
  const formatValue = (value) => {
    return Math.floor(value);
  };
  
  return (
    <div className="bg-spotify-black border-2 border-spotify-green p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Top 10</h2>
        
        <div className="flex bg-spotify-darkgray rounded-lg p-1 border border-spotify-gray">
          <button
            onClick={() => setMode('artists')}
            className={`px-5 py-2 rounded-md transition-colors font-semibold ${
              mode === 'artists'
                ? 'bg-spotify-gray text-white'
                : 'text-spotify-lightgray hover:text-white'
            }`}
          >
            Artists
          </button>
          <button
            onClick={() => setMode('songs')}
            className={`px-5 py-2 rounded-md transition-colors font-semibold ${
              mode === 'songs'
                ? 'bg-spotify-gray text-white'
                : 'text-spotify-lightgray hover:text-white'
            }`}
          >
            Songs
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {data.map((item, index) => {
          const isArtistMode = mode === 'artists';
          const itemKey = isArtistMode 
            ? item.artist 
            : `${item.trackName}|${item.artistName}`;
          const isActive = activeFilter?.type === (isArtistMode ? 'artist' : 'track') 
            && activeFilter?.value === itemKey;
          
          return (
            <div
              key={itemKey}
              onClick={() => onItemClick(isArtistMode ? 'artist' : 'track', itemKey, item)}
              className={`flex items-center gap-4 p-3 rounded-full cursor-pointer transition-colors ${
                isActive
                  ? 'bg-spotify-green'
                  : 'bg-spotify-darkgray hover:bg-spotify-gray'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isActive ? 'bg-white' : 'bg-white'
              }`}>
                <span className="text-lg font-bold text-spotify-black">
                  {index + 1}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                {isArtistMode ? (
                  <p className={`font-bold truncate text-xl ${
                    isActive ? 'text-spotify-black' : 'text-white'
                  }`}>
                    {item.artist}
                  </p>
                ) : (
                  <>
                    <p className={`font-bold truncate text-xl ${
                      isActive ? 'text-spotify-black' : 'text-white'
                    }`}>
                      {item.trackName}
                    </p>
                    <p className={`text-base truncate ${
                      isActive ? 'text-spotify-black/70' : 'text-spotify-lightgray'
                    }`}>
                      {item.artistName}
                    </p>
                  </>
                )}
              </div>
              
              <span className={`text-base font-semibold whitespace-nowrap ${
                isActive ? 'text-spotify-black' : 'text-white'
              }`}>
                {isArtistMode 
                  ? `${formatValue(item.time)} ${timeUnit === 'hours' ? 'hours' : timeUnit === 'seconds' ? 'secs' : 'mins'}`
                  : `${item.playCount} plays`
                }
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopLists;