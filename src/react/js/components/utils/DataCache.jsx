import { Component } from 'react';

/**
 * Persistent data cache
 */
class DataCache extends Component {
  /**
   * @param {string} key
   * @returns {*}
   */
  static getCachedItem(key) {
    // storage not available
    if (typeof (Storage) === 'undefined') {
      return null;
    }

    const item = localStorage.getItem(key);
    if (typeof (item) === 'undefined') {
      return null;
    }

    return item;
  }

  /**
   * @param {string} key
   * @param {*} data
   */
  static setCachedItem(key, data) {
    // storage not available
    if (typeof (Storage) === 'undefined') {
      return;
    }

    localStorage.setItem(key, data);
  }
}

export default DataCache;
