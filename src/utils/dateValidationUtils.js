/**
 * Date validation utilities for business applications
 */

/**
 * Validates and constrains days in a month to valid range (1-31)
 * @param {string|number} value - The input value to validate
 * @param {function} setter - The state setter function to call with valid value
 * @param {number} min - Minimum allowed days (default: 1)
 * @param {number} max - Maximum allowed days (default: 31)
 * @returns {void}
 */
export const handleDaysInMonthChange = (value, setter, min = 1, max = 31) => {
  const numericValue = parseInt(value) || 0;
  
  // Only update state if the value is within valid range
  if (numericValue >= min && numericValue <= max) {
    setter(numericValue);
  }
  // If value is invalid, don't update state (keeps current valid value)
};

/**
 * Creates an onChange handler for days in month inputs with validation
 * @param {function} setter - The state setter function
 * @param {number} min - Minimum allowed days (default: 1)
 * @param {number} max - Maximum allowed days (default: 31)
 * @returns {function} - Event handler function for input onChange
 */
export const createDaysInMonthHandler = (setter, min = 1, max = 31) => {
  return (event) => {
    handleDaysInMonthChange(event.target.value, setter, min, max);
  };
};

/**
 * Validates if a given number is a valid day count for a month
 * @param {number} days - Number of days to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidDaysInMonth = (days) => {
  const numericDays = parseInt(days);
  return numericDays >= 1 && numericDays <= 31;
};

/**
 * Gets the maximum days for a specific month and year
 * @param {number} month - Month (1-12)
 * @param {number} year - Full year (e.g., 2024)
 * @returns {number} - Maximum days in the specified month
 */
export const getMaxDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};
