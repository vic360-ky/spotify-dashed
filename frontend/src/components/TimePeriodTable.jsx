import { useState } from 'react';
import { Table } from 'lucide-react';
import { formatTimeWithUnit } from '../utils/exportUtils';

const TimePeriodTable = ({ data, timeUnit }) => {
  const [mode, setMode] = useState('artist'); // 'artist' or 'song'
  
  return (
    <div className="bg-spotify-darkgray p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-spotify-green rounded-lg">
            <Table size={24} className="text-spotify-black" />
          </div>
          <h2 className="text-xl font-semibold text-white">Time Period Breakdown</h2>
        </div>
        
        <div className="flex bg-spotify-gray rounded-lg p-1">
          <button
            onClick={() => setMode('artist')}
            className={`px-4 py-2 rounded-md transition-colors font-medium ${
              mode === 'artist'
                ? 'bg-spotify-green text-spotify-black'
                : 'text-spotify-lightgray hover:text-white'
            }`}
          >
            Top Artist
          </button>
          <button
            onClick={() => setMode('song')}
            className={`px-4 py-2 rounded-md transition-colors font-medium ${
              mode === 'song'
                ? 'bg-spotify-green text-spotify-black'
                : 'text-spotify-lightgray hover:text-white'
            }`}
          >
            Top Song
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-spotify-gray">
              <th className="text-left py-3 px-4 text-spotify-lightgray font-semibold">
                Time Period
              </th>
              <th className="text-left py-3 px-4 text-spotify-lightgray font-semibold">
                {mode === 'artist' ? 'Top Artist' : 'Top Song'}
              </th>
              <th className="text-right py-3 px-4 text-spotify-lightgray font-semibold">
                {mode === 'artist' ? 'Time' : 'Plays'}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr 
                key={index}
                className="border-b border-spotify-gray/50 hover:bg-spotify-gray/30 transition-colors"
              >
                <td className="py-3 px-4 text-white font-medium">
                  {row.period}
                </td>
                <td className="py-3 px-4 text-white">
                  {row.item}
                </td>
                <td className="py-3 px-4 text-right text-spotify-green font-semibold">
                  {mode === 'artist' 
                    ? formatTimeWithUnit(row.value, timeUnit)
                    : `${row.value} plays`
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimePeriodTable;