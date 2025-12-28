import { useState, useMemo } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import Filters from './components/Filters';
import StatsCards from './components/StatsCards';
import TopLists from './components/TopLists';
import ListeningOverTime from './components/ListeningOverTime';
import ListeningClock from './components/ListeningClock';
import TimePeriodTable from './components/TimePeriodTable';
import {
  filterByDateRange,
  filterByArtist,
  filterByTrack,
  getTopArtists,
  getTopTracks,
  aggregateByTimePeriod,
  getListeningByHour,
  getTopItemByTimePeriod,
  calculateStats
} from './utils/dataTransforms';

const API_URL = 'http://localhost:5000';

function App() {
  const [rawData, setRawData] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter states
  const [dateFilter, setDateFilter] = useState({ startDate: null, endDate: null });
  const [activeFilter, setActiveFilter] = useState(null); // { type: 'artist'|'track', value: string, data: object }
  const [timeUnit, setTimeUnit] = useState('minutes');
  const [timePeriod, setTimePeriod] = useState('days');
  
  // Upload handler
  const handleUpload = async (files) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload files');
      }
      
      const result = await response.json();
      setRawData(result.data);
      setAvailableDates(result.metadata.available_dates);
    } catch (err) {
      setError(err.message);
      alert('Error uploading files: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Apply all filters to get filtered data
  const filteredData = useMemo(() => {
    if (!rawData) return [];
    
    let data = rawData;
    
    // Apply date range filter
    if (dateFilter.startDate || dateFilter.endDate) {
      const startDate = dateFilter.startDate ? dateFilter.startDate.toISOString().split('T')[0] : null;
      const endDate = dateFilter.endDate ? dateFilter.endDate.toISOString().split('T')[0] : null;
      data = filterByDateRange(data, startDate, endDate);
    }
    
    // Apply artist/track filter
    if (activeFilter) {
      if (activeFilter.type === 'artist') {
        data = filterByArtist(data, activeFilter.value);
      } else if (activeFilter.type === 'track') {
        const [trackName, artistName] = activeFilter.value.split('|');
        data = filterByTrack(data, trackName, artistName);
      }
    }
    
    return data;
  }, [rawData, dateFilter, activeFilter]);
  
  // Calculate all derived data
  const stats = useMemo(() => calculateStats(filteredData, timeUnit), [filteredData, timeUnit]);
  const topArtists = useMemo(() => getTopArtists(filteredData, 10, timeUnit), [filteredData, timeUnit]);
  const topTracks = useMemo(() => getTopTracks(filteredData, 10), [filteredData]);
  const listeningOverTime = useMemo(() => aggregateByTimePeriod(filteredData, timePeriod, timeUnit), [filteredData, timePeriod, timeUnit]);
  const listeningByHour = useMemo(() => getListeningByHour(filteredData, timeUnit), [filteredData, timeUnit]);
  const timePeriodData = useMemo(() => getTopItemByTimePeriod(filteredData, 'artist', timeUnit), [filteredData, timeUnit]);
  const timePeriodDataSongs = useMemo(() => getTopItemByTimePeriod(filteredData, 'track', timeUnit), [filteredData, timeUnit]);
  
  // Handle filter changes
  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
  };
  
  const handleResetFilters = () => {
    setDateFilter({ startDate: null, endDate: null });
    setActiveFilter(null);
  };
  
  const handleItemClick = (type, value, data) => {
    // Toggle filter if clicking same item
    if (activeFilter?.type === type && activeFilter?.value === value) {
      setActiveFilter(null);
    } else {
      setActiveFilter({ type, value, data });
    }
  };
  
  const handleTimeUnitChange = (unit) => {
    setTimeUnit(unit);
  };
  
  // Show upload screen if no data
  if (!rawData) {
    return (
      <div className="min-h-screen bg-spotify-black flex items-center justify-center">
        <FileUpload onUpload={handleUpload} isLoading={isLoading} />
      </div>
    );
  }
  
  // Show dashboard
  return (
    <div className="min-h-screen bg-spotify-black">
      <Header data={filteredData} />
      
      <main id="dashboard" className="max-w-[1600px] mx-auto p-8 space-y-6">
        {/* Filters Section */}
        <Filters
          availableDates={availableDates}
          onFilterChange={handleDateFilterChange}
          onReset={handleResetFilters}
        />
        
        {/* Active Filter Badge */}
        {activeFilter && (
          <div className="bg-spotify-darkgray p-4 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-spotify-lightgray">Active Filter: </span>
              <span className="text-spotify-green font-semibold">
                {activeFilter.type === 'artist' 
                  ? activeFilter.value 
                  : activeFilter.data.trackName + ' - ' + activeFilter.data.artistName
                }
              </span>
            </div>
            <button
              onClick={() => setActiveFilter(null)}
              className="px-4 py-2 bg-spotify-gray hover:bg-spotify-green hover:text-spotify-black transition-colors rounded-lg font-medium"
            >
              Clear Filter
            </button>
          </div>
        )}
        
        {/* Stats Cards */}
        <StatsCards
          stats={stats}
          timeUnit={timeUnit}
          onTimeUnitChange={handleTimeUnitChange}
        />
        
        {/* Top Lists and Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopLists
            topArtists={topArtists}
            topTracks={topTracks}
            timeUnit={timeUnit}
            activeFilter={activeFilter}
            onItemClick={handleItemClick}
          />
          
          <ListeningOverTime
            data={listeningOverTime}
            timeUnit={timeUnit}
          />
        </div>
        
        {/* Clock and Table Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ListeningClock
            data={listeningByHour}
            timeUnit={timeUnit}
          />
          
          <TimePeriodTable
            data={timePeriodData}
            timeUnit={timeUnit}
          />
        </div>
      </main>
    </div>
  );
}

export default App;