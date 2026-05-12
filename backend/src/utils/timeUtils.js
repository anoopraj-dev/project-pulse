/**
 * Utility to build a Date object with +05:30 (India) offset
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} time - Time in HH:mm format
 * @returns {Date}
 */
export const buildUTCDate = (date, time) => {
    // If date is already a Date object, convert to YYYY-MM-DD
    const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;
    return new Date(`${dateStr}T${time}:00+05:30`);
};

/**
 * Get current time in India (+05:30)
 * @returns {Date}
 */
export const getIndiaNow = () => {
    return new Date();
};

/**
 * Get start of day in India (+05:30) as a Date object
 * @returns {Date}
 */
export const getStartOfTodayIndia = () => {
    const now = new Date();
    const indiaTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    const year = indiaTime.getUTCFullYear();
    const month = String(indiaTime.getUTCMonth() + 1).padStart(2, '0');
    const date = String(indiaTime.getUTCDate()).padStart(2, '0');
    
    return new Date(`${year}-${month}-${date}T00:00:00+05:30`);
};

/**
 * Get YYYY-MM-DD string in India timezone (+05:30)
 * @param {Date} date - Date object
 * @returns {string}
 */
export const getIndiaDateString = (date = new Date()) => {
    const indiaTime = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
    return indiaTime.toISOString().split('T')[0];
};
