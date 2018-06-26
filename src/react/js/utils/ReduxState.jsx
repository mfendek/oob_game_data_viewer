/**
 * Redux state helpers
 */

/**
 * Extract local state from global state by key
 *
 * @param {Object} state
 * @param {string} key
 * @returns {Object}
 */
export const getLocalState = (state, key) => (
  (typeof state[key] !== 'undefined') ? state[key] : {}
);

export default { getLocalState };
