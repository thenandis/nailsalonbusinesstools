/**
 * Creates input props for decimal (dollar/percentage) fields with up to two decimal places
 * @param {string|number} value - Current value
 * @param {function} setter - State setter function
 * @param {object} options - Additional input options (optional)
 * @returns {object} - Props object for input element
 */
export const createDecimalInputProps = (value, setter, options = {}) => {
  return createNumericInputProps(value, setter, {
    allowDecimals: true,
    maxDecimals: 2,
    step: '0.01',
    ...options
  });
};
// Utility functions for handling numeric inputs and preventing leading zeros

/**
 * Handles numeric input changes with validation
 * @param {string} value - The input value
 * @param {function} setter - The state setter function
 * @param {boolean} allowDecimals - Whether to allow decimal points (default: false)
 * @param {number} maxDecimals - Maximum number of decimal places (default: 2)
 */
export const handleNumericChange = (value, setter, allowDecimals = false, maxDecimals = 2) => {
  // Allow empty string
  if (value === '') {
    setter('');
    return;
  }
  
  // For decimal inputs, allow decimal points and numbers
  if (allowDecimals) {
    // Create regex pattern based on maxDecimals
    const decimalPattern = maxDecimals > 0 ? `\\d*\\.?\\d{0,${maxDecimals}}` : '\\d*\\.?\\d*';
    const regex = new RegExp(`^${decimalPattern}$`);
    
    if (regex.test(value)) {
      setter(value);
    }
  } else {
    // For integer inputs, only allow whole numbers
    if (/^\d*$/.test(value)) {
      setter(value);
    }
  }
};

/**
 * Gets numeric value for calculations, handling empty strings safely
 * @param {string|number} value - The input value
 * @param {number} defaultValue - Default value to use if input is empty or invalid (default: 0)
 * @returns {number} - The numeric value or default
 */
export const getNumericValue = (value, defaultValue = 0) => {
  if (value === '' || value === null || value === undefined) {
    return defaultValue;
  }
  const numValue = Number(value);
  return isNaN(numValue) ? defaultValue : numValue;
};

/**
 * Creates a numeric input change handler with predefined settings
 * @param {function} setter - The state setter function
 * @param {boolean} allowDecimals - Whether to allow decimal points
 * @param {number} maxDecimals - Maximum decimal places
 * @returns {function} - The onChange handler function
 */
export const createNumericHandler = (setter, allowDecimals = false, maxDecimals = 2) => {
  return (e) => handleNumericChange(e.target.value, setter, allowDecimals, maxDecimals);
};

/**
 * Validates and formats a numeric input for display
 * @param {string|number} value - The value to format
 * @param {boolean} allowDecimals - Whether decimals are allowed
 * @returns {string|number} - The formatted value
 */
export const formatNumericInput = (value, allowDecimals = false) => {
  if (value === '' || value === null || value === undefined) {
    return '';
  }
  
  if (allowDecimals) {
    return value;
  }
  
  // For integers, ensure no decimal point
  const numValue = getNumericValue(value);
  return numValue.toString();
};

/**
 * Formats a number with comma separators for display
 * @param {string|number} value - The number to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @param {boolean} includeDecimals - Whether to show decimal places (default: true)
 * @returns {string} - Formatted number string
 */
export const formatNumberWithCommas = (value, decimals = 2, includeDecimals = true) => {
  const numValue = getNumericValue(value, 0);
  
  if (includeDecimals) {
    return numValue.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  } else {
    return Math.round(numValue).toLocaleString('en-US');
  }
};

/**
 * Formats currency with dollar sign and commas
 * @param {string|number} value - The number to format as currency
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (value, decimals = 2) => {
  const numValue = getNumericValue(value, 0);
  return `$${formatNumberWithCommas(numValue, decimals, decimals > 0)}`;
};

/**
 * Creates input props object with numeric validation
 * @param {string|number} value - Current value
 * @param {function} setter - State setter function
 * @param {object} options - Configuration options
 * @returns {object} - Props object for input element
 */
export const createNumericInputProps = (value, setter, options = {}) => {
  const {
    allowDecimals = false,
    maxDecimals = 2,
    step = allowDecimals ? '0.01' : '1',
    min = undefined,
    max = undefined,
    style = {}
  } = options;

  return {
    type: 'number',
    value: value,
    onChange: createNumericHandler(setter, allowDecimals, maxDecimals),
    step: step,
    min: min,
    max: max,
    style: {
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      ...style
    }
  };
};
