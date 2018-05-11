import { Component } from 'react';

/**
 * Date formatting
 */
class DateFormat extends Component {
  /**
   * Format timestamp into date
   *
   * @param {number} timestamp
   * @returns {string}
   */
  static formatDate(timestamp) {
    const date = new Date(timestamp * 1000);

    return date.toLocaleDateString();
  }
}

export default DateFormat;
