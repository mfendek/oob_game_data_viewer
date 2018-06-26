/**
 * URL params manipulation
 */

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

  return '?'.concat(
    Object
      .keys(params)
      .map(name => ''.concat(encodeURIComponent(name), '=', encodeURIComponent(params[name])))
      .join('&'),
  );
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
  const currentPage = pagination.currentPage;
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

export default { getUrlWithParams, generatePermalink };
