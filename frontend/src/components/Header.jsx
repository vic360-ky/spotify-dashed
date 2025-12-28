import { exportToCSV, exportDashboardAsPNG } from '../utils/exportUtils';
import spotifyLogo from '../assets/spotify_logo_green.png';

const Header = ({ data }) => {
  const handleCSVExport = () => {
    exportToCSV(data, `spotify_dashed_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handlePNGExport = () => {
    exportDashboardAsPNG('dashboard', `spotify_dashed_${new Date().toISOString().split('T')[0]}.png`);
  };

  return (
    <header className="bg-spotify-black border-b border-spotify-gray px-8 py-6">
      <div className="max-w-[1800px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={spotifyLogo} alt="Spotify" className="h-12 w-12" />
          <h1 className="text-4xl font-bold text-spotify-green">
            Spotify Dashed
          </h1>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={handleCSVExport}
            disabled={!data || data.length === 0}
            className="px-6 py-3 bg-spotify-darkgray hover:bg-spotify-gray text-white transition-colors rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed border border-spotify-gray"
          >
            Export data to CSV
          </button>
          
          <button
            onClick={handlePNGExport}
            disabled={!data || data.length === 0}
            className="px-6 py-3 bg-spotify-darkgray hover:bg-spotify-gray text-white transition-colors rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed border border-spotify-gray"
          >
            Export dashboard to PNG
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;