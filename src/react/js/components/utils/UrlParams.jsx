import { Component } from 'react';

/**
 * URL params manipulation
 */
class UrlParams extends Component {
  /**
   * Generate url with provided params
   *
   * @param {Object} data
   * @returns {string}
   */
  static getUrlWithParams(data) {
    const params = {};

    // filters
    if (typeof data.f !== 'undefined') {
      params.f = JSON.stringify(data.f);
    }

    // pagination
    if (typeof data.p !== 'undefined') {
      params.p = data.p;
    }

    // unit comparison
    if (typeof data.c !== 'undefined') {
      params.c = data.c;
    }

    if (Object.keys(params).length === 0) {
      return '';
    }

    return '?'.concat(
      Object
        .keys(params)
        .map(name => ''.concat(encodeURIComponent(name), '=', encodeURIComponent(params[name])))
        .join('&'),
    );
  }
}

export default UrlParams;
