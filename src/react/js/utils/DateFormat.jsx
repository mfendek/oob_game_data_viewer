/**
 * Date formatting
 */

/**
 * Format timestamp into date
 *
 * @param {number} timestamp
 * @returns {string}
 */
export const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);

  return date.toLocaleDateString();
};

export default { formatDate };
