import {
  getNumberOfPages,
  getFilteredList,
} from './ListManipulation';

/**
 * Persistent data cache
 */

/**
 *
 * @param {string} key
 * @returns {*}
 */
export const getCachedItem = (key) => {
  // storage not available
  if (typeof (Storage) === 'undefined') {
    return null;
  }

  const item = localStorage.getItem(key);
  if (typeof (item) === 'undefined') {
    return null;
  }

  return item;
};

/**
 * @param {string} key
 * @param {*} data
 */
export const setCachedItem = (key, data) => {
  // storage not available
  if (typeof (Storage) === 'undefined') {
    return;
  }

  localStorage.setItem(key, data);
};

/**
 * @param {string} appVersion
 * @param {string} key
 * @returns {string}
 */
export const getCacheKey = (appVersion, key) => (
  appVersion.concat('_', key)
);

/**
 * Validate loaded data and sanitize of needed
 * @param {Object} data
 * @returns {Object}
 */
export const sanitizeData = (data) => {
  const { unitsData, unitsList, filters, pagination, filtersInit, compareId } = data;

  // add initial filter values to filter data
  const filterKeys = Object.keys(filtersInit);
  if (filterKeys.length > 0) {
    for (let i = 0; i < filterKeys.length; i += 1) {
      const filterName = filterKeys[i];
      filters[filterName].value = filtersInit[filterName];
    }
  }

  const list = getFilteredList(
    unitsData,
    unitsList,
    filters,
  );

  // validate current page
  const pagesTotal = getNumberOfPages(list, pagination.itemsPerPage);
  const currentPage = Math.min(pagination.currentPage, pagesTotal);
  const newPagination = {
    ...pagination,
    currentPage,
  };

  return {
    ...data,
    pagination: newPagination,
    filters,
    // validate compare id
    compareId: (unitsList.indexOf(compareId) >= 0) ? compareId : -1,
  };
};

export default { getCachedItem, setCachedItem, getCacheKey, sanitizeData };
