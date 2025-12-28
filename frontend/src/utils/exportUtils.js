import { toPng } from 'html-to-image';

/**
 * Export data to CSV
 */
export const exportToCSV = (data, filename = 'spotify_data.csv') => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }
  
  // Define CSV headers
  const headers = [
    'endTime',
    'artistName',
    'trackName',
    'msPlayed',
    'secondsPlayed',
    'minutesPlayed',
    'hoursPlayed',
    'date',
    'hour'
  ];
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in values
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export dashboard as PNG
 */
export const exportDashboardAsPNG = async (elementId = 'dashboard', filename = 'spotify_dashboard.png') => {
  const element = document.getElementById(elementId);
  
  if (!element) {
    alert('Dashboard element not found');
    return;
  }
  
  try {
    // Show loading state
    const originalCursor = document.body.style.cursor;
    document.body.style.cursor = 'wait';
    
    // Generate PNG
    const dataUrl = await toPng(element, {
      cacheBust: true,
      backgroundColor: '#121212',
      pixelRatio: 2 // Higher quality
    });
    
    // Create download link
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
    
    // Restore cursor
    document.body.style.cursor = originalCursor;
  } catch (error) {
    console.error('Error exporting dashboard:', error);
    alert('Failed to export dashboard. Please try again.');
    document.body.style.cursor = 'default';
  }
};

/**
 * Format time value with unit
 */
export const formatTimeWithUnit = (value, unit) => {
  const formatted = value.toFixed(2);
  
  switch (unit) {
    case 'hours':
      return `${formatted} hrs`;
    case 'seconds':
      return `${formatted} secs`;
    case 'minutes':
    default:
      return `${formatted} mins`;
  }
};