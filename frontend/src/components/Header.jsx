import { Download, Image } from 'lucide-react';
import { exportToCSV, exportDashboardAsPNG } from '../utils/exportUtils';

const Header = ({ data }) => {
  const handleCSVExport = () => {
    exportToCSV(data, `spotify_dashed_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handlePNGExport = () => {
    exportDashboardAsPNG('dashboard', `spotify_dashed_${new Date().toISOString().split('T')[0]}.png`);
  };

  return (
    <header className="bg-spotify-darkgray border-b border-spotify-gray px-8 py-4">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <h1 className="text-3xl font-bold text-spotify-green">
          Spotify Dashed
        </h1>
        
        <div className="flex gap-3">
          <button
            onClick={handleCSVExport}
            disabled={!data || data.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-spotify-gray hover:bg-spotify-green hover:text-spotify-black transition-colors rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-spotify-gray disabled:hover:text-white"
          >
            <Download size={18} />
            Export Data
          </button>
          
          <button
            onClick={handlePNGExport}
            disabled={!data || data.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-spotify-gray hover:bg-spotify-green hover:text-spotify-black transition-colors rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-spotify-gray disabled:hover:text-white"
          >
            <Image size={18} />
            Export PNG
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;