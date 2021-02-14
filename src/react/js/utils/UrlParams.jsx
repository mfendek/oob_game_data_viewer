/**
 * URL params manipulation
 */

/**
 * Check if url is valid
 *
 * @param {string} url
 * @returns {boolean}
 */
export const isUrlValid = (url) => {
  const regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

  return regexp.test(url);
};

/**
 * Generate query string form params
 *
 * @param {Object} params
 * @returns {string}
 */
export const queryString = (params) => {
  if (Object.keys(params).length === 0) {
    return '';
  }

  return '?'.concat(
    Object
      .keys(params)
      .map((name) => ''.concat(encodeURIComponent(name), '=', encodeURIComponent(params[name])))
      .join('&'),
  );
};

/**
 * Generate url with provided params
 *
 * @param {Object} data
 * @returns {string}
 */
export const getUrlWithParams = (data) => {
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

  return queryString(params);
};

/**
 * Generate permalink based on current filters and page
 *
 * @param {Object} pagination
 * @param {Object} filters
 * @param {number} compareId
 * @returns {string}
 */
export const generatePermalink = (pagination, filters, compareId) => {
  const active = {};
  const { currentPage } = pagination;
  const types = Object.keys(filters);

  for (let i = 0; i < types.length; i += 1) {
    const name = types[i];

    if (filters[name].value !== '') {
      active[name] = filters[name].value;
    }
  }

  const params = {};

  if (currentPage > 1) {
    params.p = currentPage;
  }

  if (Object.keys(active).length > 0) {
    params.f = active;
  }

  if (compareId > -1) {
    params.c = compareId;
  }

  return getUrlWithParams(params);
};

export default {
  isUrlValid, queryString, getUrlWithParams, generatePermalink,
};
