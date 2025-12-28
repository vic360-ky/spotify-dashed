import { useState } from 'react';
import { formatTimeWithUnit } from '../utils/exportUtils';
import { Trophy } from 'lucide-react';

const TopLists = ({ topArtists, topTracks, timeUnit, activeFilter, onItemClick }) => {
  const [mode, setMode] = useState('artists'); // 'artists' or 'songs'
  
  const data = mode === 'artists' ? topArtists : topTracks;
  
  return (
    <div className="bg-spotify-darkgray p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-spotify-green rounded-lg">
            <Trophy size={24} className="text-spotify-black" />
          </div>
          <h2 className="text-xl font-semibold text-white">Top 10</h2>
        </div>
        
        <div className="flex bg-spotify-gray rounded-lg p-1">
          <button
            onClick={() => setMode('artists')}
            className={`px-4 py-2 rounded-md transition-colors font-medium ${
              mode === 'artists'
                ? 'bg-spotify-green text-spotify-black'
                : 'text-spotify-lightgray hover:text-white'
            }`}
          >
            Artists
          </button>
          <button
            onClick={() => setMode('songs')}
            className={`px-4 py-2 rounded-md transition-colors font-medium ${
              mode === 'songs'
                ? 'bg-spotify-green text-spotify-black'
                : 'text-spotify-lightgray hover:text-white'
            }`}
          >
            Songs
          </button>
        </div>
      </div>
      
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
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
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                isActive
                  ? 'bg-spotify-green text-spotify-black'
                  : 'bg-spotify-gray hover:bg-spotify-gray/70'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className={`text-lg font-bold w-6 text-center ${
                  isActive ? 'text-spotify-black' : 'text-spotify-green'
                }`}>
                  {index + 1}
                </span>
                
                <div className="flex-1 min-w-0">
                  {isArtistMode ? (
                    <p className={`font-medium truncate ${
                      isActive ? 'text-spotify-black' : 'text-white'
                    }`}>
                      {item.artist}
                    </p>
                  ) : (
                    <>
                      <p className={`font-medium truncate ${
                        isActive ? 'text-spotify-black' : 'text-white'
                      }`}>
                        {item.trackName}
                      </p>
                      <p className={`text-sm truncate ${
                        isActive ? 'text-spotify-black/70' : 'text-spotify-lightgray'
                      }`}>
                        {item.artistName}
                      </p>
                    </>
                  )}
                </div>
              </div>
              
              <span className={`text-sm font-semibold ml-3 ${
                isActive ? 'text-spotify-black' : 'text-spotify-green'
              }`}>
                {isArtistMode 
                  ? formatTimeWithUnit(item.time, timeUnit)
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