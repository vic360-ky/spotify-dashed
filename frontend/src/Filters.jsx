import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO } from 'date-fns';
import { RotateCcw } from 'lucide-react';

const Filters = ({ availableDates, onFilterChange, onReset }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  // Convert available dates to Date objects for DatePicker
  const dateObjects = availableDates.map(dateStr => parseISO(dateStr));
  const minDate = dateObjects.length > 0 ? new Date(Math.min(...dateObjects)) : null;
  const maxDate = dateObjects.length > 0 ? new Date(Math.max(...dateObjects)) : null;
  
  useEffect(() => {
    onFilterChange({ startDate, endDate });
  }, [startDate, endDate]);
  
  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    onReset();
  };
  
  const isDateAvailable = (date) => {
    return dateObjects.some(d => 
      d.getFullYear() === date.getFullYear() &&
      d.getMonth() === date.getMonth() &&
      d.getDate() === date.getDate()
    );
  };
  
  return (
    <div className="bg-spotify-darkgray p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-spotify-green">Filters</h2>
      
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-2 text-spotify-lightgray">
            From Date
          </label>
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            maxDate={endDate || maxDate}
            minDate={minDate}
            filterDate={isDateAvailable}
            placeholderText="Select start date"
            className="w-full px-4 py-2 bg-spotify-gray text-white rounded-lg border border-spotify-gray focus:border-spotify-green focus:outline-none"
            dateFormat="MMM d, yyyy"
          />
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-2 text-spotify-lightgray">
            To Date
          </label>
          <DatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate || minDate}
            maxDate={maxDate}
            filterDate={isDateAvailable}
            placeholderText="Select end date"
            className="w-full px-4 py-2 bg-spotify-gray text-white rounded-lg border border-spotify-gray focus:border-spotify-green focus:outline-none"
            dateFormat="MMM d, yyyy"
          />
        </div>
        
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-spotify-gray hover:bg-spotify-green hover:text-spotify-black transition-colors rounded-lg font-medium"
        >
          <RotateCcw size={18} />
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default Filters;