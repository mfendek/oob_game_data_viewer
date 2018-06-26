/**
 * Game math functions
 */

/**
 * calculate terrain points
 *
 * @param {number} points
 * @param {number} cost
 * @param {number|float} factor
 * @returns {number}
 */
export const getTerrainPoints = (points, cost, factor) => {
  if (cost === 0) {
    return 0;
  }

  return Math.floor(points / (cost * factor));
};

export default { getTerrainPoints };
