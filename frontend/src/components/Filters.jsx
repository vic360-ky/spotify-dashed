import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO } from 'date-fns';

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
    <div className="bg-spotify-black border-2 border-spotify-green p-6 rounded-2xl">
      <div className="flex items-end gap-4">
        <div className="w-40">
          <label className="block text-sm font-semibold mb-3 text-white">
            From
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
            placeholderText="2025/01/01"
            className="w-full px-3 py-3 bg-spotify-darkgray text-white rounded-lg border border-spotify-gray focus:border-spotify-green focus:outline-none font-medium text-sm"
            dateFormat="yyyy/MM/dd"
          />
        </div>
        
        <div className="w-40">
          <label className="block text-sm font-semibold mb-3 text-white">
            To
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
            placeholderText="2025/12/01"
            className="w-full px-3 py-3 bg-spotify-darkgray text-white rounded-lg border border-spotify-gray focus:border-spotify-green focus:outline-none font-medium text-sm"
            dateFormat="yyyy/MM/dd"
          />
        </div>
        
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-spotify-darkgray hover:bg-spotify-gray text-white transition-colors rounded-lg font-semibold border border-spotify-gray whitespace-nowrap"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default Filters;