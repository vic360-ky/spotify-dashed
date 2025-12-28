import { parseISO, format, startOfDay, startOfWeek, startOfMonth } from 'date-fns';

/**
 * Filter data by date range
 */
export const filterByDateRange = (data, startDate, endDate) => {
  if (!data || data.length === 0) return [];
  
  return data.filter(item => {
    const itemDate = parseISO(item.date);
    const isAfterStart = !startDate || itemDate >= parseISO(startDate);
    const isBeforeEnd = !endDate || itemDate <= parseISO(endDate);
    return isAfterStart && isBeforeEnd;
  });
};

/**
 * Filter data by artist
 */
export const filterByArtist = (data, artistName) => {
  if (!data || !artistName) return data;
  return data.filter(item => item.artistName === artistName);
};

/**
 * Filter data by track
 */
export const filterByTrack = (data, trackName, artistName = null) => {
  if (!data || !trackName) return data;
  let filtered = data.filter(item => item.trackName === trackName);
  if (artistName) {
    filtered = filtered.filter(item => item.artistName === artistName);
  }
  return filtered;
};

/**
 * Get time value based on unit
 */
export const getTimeValue = (item, timeUnit) => {
  switch (timeUnit) {
    case 'hours':
      return item.hoursPlayed;
    case 'minutes':
      return item.minutesPlayed;
    case 'seconds':
      return item.secondsPlayed;
    default:
      return item.minutesPlayed;
  }
};

/**
 * Calculate top artists by total time played
 */
export const getTopArtists = (data, limit = 10, timeUnit = 'minutes') => {
  if (!data || data.length === 0) return [];
  
  const artistMap = {};
  
  data.forEach(item => {
    const artist = item.artistName;
    const time = getTimeValue(item, timeUnit);
    
    if (!artistMap[artist]) {
      artistMap[artist] = 0;
    }
    artistMap[artist] += time;
  });
  
  return Object.entries(artistMap)
    .map(([artist, time]) => ({ artist, time }))
    .sort((a, b) => b.time - a.time)
    .slice(0, limit);
};

/**
 * Calculate top tracks by play count
 */
export const getTopTracks = (data, limit = 10) => {
  if (!data || data.length === 0) return [];
  
  const trackMap = {};
  
  data.forEach(item => {
    const key = `${item.trackName}|${item.artistName}`;
    
    if (!trackMap[key]) {
      trackMap[key] = {
        trackName: item.trackName,
        artistName: item.artistName,
        playCount: 0
      };
    }
    trackMap[key].playCount += 1;
  });
  
  return Object.values(trackMap)
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, limit);
};

/**
 * Aggregate listening data over time
 */
export const aggregateByTimePeriod = (data, period = 'days', timeUnit = 'minutes') => {
  if (!data || data.length === 0) return [];
  
  const aggregated = {};
  
  data.forEach(item => {
    const date = parseISO(item.endTime);
    let key;
    
    switch (period) {
      case 'weeks':
        key = format(startOfWeek(date, { weekStartsOn: 0 }), 'yyyy-MM-dd');
        break;
      case 'months':
        key = format(startOfMonth(date), 'yyyy-MM-dd');
        break;
      case 'days':
      default:
        key = format(startOfDay(date), 'yyyy-MM-dd');
        break;
    }
    
    const time = getTimeValue(item, timeUnit);
    
    if (!aggregated[key]) {
      aggregated[key] = 0;
    }
    aggregated[key] += time;
  });
  
  return Object.entries(aggregated)
    .map(([date, time]) => ({ date, time }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Get listening data by hour of day
 */
export const getListeningByHour = (data, timeUnit = 'minutes') => {
  if (!data || data.length === 0) return [];
  
  const hourData = Array(24).fill(0);
  
  data.forEach(item => {
    const time = getTimeValue(item, timeUnit);
    hourData[item.hour] += time;
  });
  
  const totalTime = hourData.reduce((sum, time) => sum + time, 0);
  
  return hourData.map((time, hour) => ({
    hour,
    time,
    percentage: totalTime > 0 ? (time / totalTime) * 100 : 0
  }));
};

/**
 * Get top item (artist or track) by time period
 */
export const getTopItemByTimePeriod = (data, mode = 'artist', timeUnit = 'minutes') => {
  if (!data || data.length === 0) return [];
  
  const periods = [
    { label: '🌙 12am-6am', start: 0, end: 6 },
    { label: '🌅 6am-12pm', start: 6, end: 12 },
    { label: '☀️ 12pm-6pm', start: 12, end: 18 },
    { label: '🌆 6pm-12am', start: 18, end: 24 }
  ];
  
  return periods.map(period => {
    const periodData = data.filter(item => 
      item.hour >= period.start && item.hour < period.end
    );
    
    if (periodData.length === 0) {
      return {
        period: period.label,
        item: 'N/A',
        value: 0
      };
    }
    
    if (mode === 'artist') {
      const topArtists = getTopArtists(periodData, 1, timeUnit);
      return {
        period: period.label,
        item: topArtists[0]?.artist || 'N/A',
        value: topArtists[0]?.time || 0
      };
    } else {
      const topTracks = getTopTracks(periodData, 1);
      return {
        period: period.label,
        item: topTracks[0] ? `${topTracks[0].trackName} - ${topTracks[0].artistName}` : 'N/A',
        value: topTracks[0]?.playCount || 0
      };
    }
  });
};

/**
 * Calculate summary statistics
 */
export const calculateStats = (data, timeUnit = 'minutes') => {
  if (!data || data.length === 0) {
    return {
      totalTime: 0,
      uniqueArtists: 0,
      uniqueTracks: 0
    };
  }
  
  const totalTime = data.reduce((sum, item) => sum + getTimeValue(item, timeUnit), 0);
  const uniqueArtists = new Set(data.map(item => item.artistName)).size;
  const uniqueTracks = new Set(data.map(item => `${item.trackName}|${item.artistName}`)).size;
  
  return {
    totalTime,
    uniqueArtists,
    uniqueTracks
  };
};