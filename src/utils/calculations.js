/**
 * Calculate investment growth over time with monthly contributions
 * @param {number} monthlyInvestment - Monthly investment amount
 * @param {number} annualReturnRate - Annual return rate in percentage
 * @param {number} years - Time period in years
 * @returns {Array} Array of data points with year and value
 */
export function calculateInvestmentGrowth(monthlyInvestment, annualReturnRate, years) {
  const monthlyRate = annualReturnRate / 100 / 12;
  const data = [];
  let currentValue = 0;

  // Handle fractional years by calculating the exact number of months
  const totalMonths = Math.ceil(years * 12);
  
  for (let month = 0; month <= totalMonths; month++) {
    // Only add data points for each year to avoid too much data
    if (month % 12 === 0) {
      data.push({ year: month / 12, value: currentValue });
    }
    
    // Skip first month (start value is 0)
    if (month === 0) continue;
    
    // Add investment and apply monthly return
    currentValue += monthlyInvestment;
    currentValue *= (1 + monthlyRate);
  }
  
  // Ensure final point is exact by calculating separately 
  // to guarantee intersection at exact year point
  if (years > 0) {
    const exactMonths = years * 12;
    let exactValue = 0;
    
    for (let month = 1; month <= exactMonths; month++) {
      exactValue += monthlyInvestment;
      exactValue *= (1 + monthlyRate);
    }
    
    // Replace or add final point with exact calculation
    // Find index of existing data point with the same year if it exists
    const existingIndex = data.findIndex(point => Math.abs(point.year - years) < 0.001);
    if (existingIndex >= 0) {
      data[existingIndex].value = exactValue;
    } else {
      data.push({ year: years, value: exactValue });
      // Sort to maintain order
      data.sort((a, b) => a.year - b.year);
    }
  }
  
  return data;
}

/**
 * Calculate billionaire's wealth growth over time
 * @param {number} initialNetWorth - Initial net worth
 * @param {number} cagr - Compound Annual Growth Rate in percentage
 * @param {number} years - Time period in years
 * @returns {Array} Array of data points with year and value
 */
export function calculateBillionaireGrowth(initialNetWorth, cagr, years) {
  const annualGrowthRate = cagr / 100;
  const data = [];
  
  // Generate integer year data points
  const totalYears = Math.ceil(years);
  
  for (let year = 0; year <= totalYears; year++) {
    // Only include data points up to the requested years
    if (year <= years) {
      const value = initialNetWorth * Math.pow(1 + annualGrowthRate, year);
      data.push({ year, value });
    }
  }
  
  // Always include the exact final year point
  if (!data.some(item => Math.abs(item.year - years) < 0.001)) {
    const value = initialNetWorth * Math.pow(1 + annualGrowthRate, years);
    data.push({ year: years, value });
    
    // Sort the data array by year
    data.sort((a, b) => a.year - b.year);
  }
  
  return data;
}

/**
 * Convert USD to INR
 * @param {number} usdValue - Value in USD
 * @returns {number} Value in INR
 */
export function convertToINR(usdValue) {
  // Using fixed exchange rate for consistency (1 USD = 83 INR approximately)
  const exchangeRate = 83;
  return usdValue * exchangeRate;
}

/**
 * Format currency values for display
 * @param {number} value - Value to format
 * @param {string} currencyCode - Currency code (USD or INR)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value, currencyCode = 'USD') {
  // Convert to INR if requested
  const numValue = currencyCode === 'INR' ? convertToINR(value) : value;
  const currencySymbol = currencyCode === 'INR' ? '₹' : '$';
  
  // Handle potentially infinite or NaN values
  if (!isFinite(value) || isNaN(value)) {
    return `${currencySymbol}∞`;
  }
  
  // Special handling for very small values to show precise decimals
  if (numValue > 0 && numValue < 1) {
    return `${currencySymbol}${numValue.toFixed(6)}`;
  }
  
  // For negative values, special handling
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    // Use the same formatting as positive values, but add the negative sign
    const formatted = formatCurrency(absValue, currencyCode);
    return `-${formatted}`;
  }
  
  // For INR, use Indian number formatting with lakhs and crores
  if (currencyCode === 'INR') {
    // For extremely large values, use lakh crore format - without cap
    if (numValue >= 1e12) { // 1 lakh crore (1,00,00,00,00,000)
      const lakhCrores = (numValue / 1e12).toFixed(2);
      return `${currencySymbol}${lakhCrores} lakh crore`;
    }
    // For large values, use crore format
    else if (numValue >= 1e7) { // 1 crore (1,00,00,000)
      const crores = (numValue / 1e7).toFixed(2);
      return `${currencySymbol}${crores} crore`;
    } 
    else if (numValue >= 1e5) { // 1 lakh (1,00,000)
      const lakhs = (numValue / 1e5).toFixed(2);
      return `${currencySymbol}${lakhs} lakh`;
    } 
    else if (numValue >= 1e3) { // 1 thousand (1,000)
      return `${currencySymbol}${numValue.toLocaleString()}`;
    } 
    else {
      return `${currencySymbol}${numValue.toLocaleString()}`;
    }
  } 
  // For USD, use Western formatting with millions and billions - without cap
  else {
    // Improve extremely large value presentation - for quadrillions and beyond
    if (numValue >= 1e18) {
      return `${currencySymbol}${(numValue / 1e18).toFixed(2)} quintillion`;
    } else if (numValue >= 1e15) {
      return `${currencySymbol}${(numValue / 1e15).toFixed(2)} quadrillion`;
    } else if (numValue >= 1e12) {
      return `${currencySymbol}${(numValue / 1e12).toFixed(2)}T`;
    } else if (numValue >= 1e9) {
      return `${currencySymbol}${(numValue / 1e9).toFixed(2)}B`;
    } else if (numValue >= 1e6) {
      return `${currencySymbol}${(numValue / 1e6).toFixed(2)}M`;
    } else if (numValue >= 1e3) {
      return `${currencySymbol}${(numValue / 1e3).toFixed(2)}K`;
    } else {
      return `${currencySymbol}${numValue.toFixed(2)}`;
    }
  }
}

/**
 * Format large numbers for display with currency
 * @param {number} value - Value to format 
 * @param {string} currencyCode - Currency code (USD or INR)
 * @returns {string} Formatted number string
 */
export function formatNumber(value, currencyCode = 'USD') {
  // Handle potentially infinite or NaN values
  if (!isFinite(value) || isNaN(value)) {
    return '∞';
  }
  
  const numValue = currencyCode === 'INR' ? convertToINR(value) : value;
  
  // Format according to Indian numbering system for INR - removed cap
  if (currencyCode === 'INR') {
    if (numValue >= 1e12) {
      return `${(numValue / 1e12).toFixed(2)} lakh crore`;
    } else if (numValue >= 1e11) {
      return `${(numValue / 1e11).toFixed(2)} thousand crore`;
    } else if (numValue >= 1e9) {
      return `${(numValue / 1e9).toFixed(2)} hundred crore`;
    } else if (numValue >= 1e7) {
      return `${(numValue / 1e7).toFixed(2)} crore`;
    } else if (numValue >= 1e5) {
      return `${(numValue / 1e5).toFixed(2)} lakh`;
    } else if (numValue >= 1e3) {
      return `${(numValue / 1e3).toFixed(2)} thousand`;
    } else {
      return numValue.toFixed(2);
    }
  } 
  // Format according to Western numbering for USD - removed cap
  else {
    if (numValue >= 1e15) {
      return `${(numValue / 1e15).toFixed(2)} quadrillion`;
    } else if (numValue >= 1e12) {
      return `${(numValue / 1e12).toFixed(2)} trillion`;
    } else if (numValue >= 1e9) {
      return `${(numValue / 1e9).toFixed(2)} billion`;
    } else if (numValue >= 1e6) {
      return `${(numValue / 1e6).toFixed(2)} million`;
    } else if (numValue >= 1e3) {
      return `${(numValue / 1e3).toFixed(2)} thousand`;
    } else {
      return numValue.toFixed(2);
    }
  }
}
