// Utility functions for file exports and downloads

/**
 * Generate timestamp string for file names in format YYYYMMDD_HHMM
 * @returns {string} Timestamp string
 */
export const getTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}_${hours}${minutes}`;
};

/**
 * Generate filename with timestamp
 * @param {string} baseName - Base filename without extension
 * @param {string} extension - File extension (default: 'csv')
 * @returns {string} Filename with timestamp
 */
export const getTimestampedFilename = (baseName, extension = 'csv') => {
  const timestamp = getTimestamp();
  return `${baseName}_${timestamp}.${extension}`;
};

/**
 * Download CSV content as a file
 * @param {string} csvContent - CSV content to download
 * @param {string} filename - Filename (will have timestamp added automatically)
 */
export const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const timestampedFilename = getTimestampedFilename(filename, 'csv');
  
  link.setAttribute('href', url);
  link.setAttribute('download', timestampedFilename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
};
