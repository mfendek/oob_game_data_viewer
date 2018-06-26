export const LIST_TOGGLE_TERRAIN = 'LIST_TOGGLE_TERRAIN';
export const FILTERS_SELECT_FILTER = 'FILTERS_SELECT_FILTER';
export const FILTERS_CLEAR_FILTERS = 'FILTERS_CLEAR_FILTERS';
export const PAGINATION_FLIP_PAGE = 'PAGINATION_FLIP_PAGE';
export const LIST_START_COMPARE = 'LIST_START_COMPARE';
export const LIST_CLEAR_COMPARE = 'LIST_CLEAR_COMPARE';
export const DATA_LOADED_SUCCESS = 'DATA_LOADED_SUCCESS';
export const DATA_LOADED_FAILURE = 'DATA_LOADED_FAILURE';

export const listToggleTerrain = unitId => ({
  type: LIST_TOGGLE_TERRAIN,
  unitId,
});

export const filtersSelectFilter = (name, e) => ({
  type: FILTERS_SELECT_FILTER,
  name,
  e,
});

export const filtersClearFilters = () => ({
  type: FILTERS_CLEAR_FILTERS,
});

export const paginationFlipPage = target => ({
  type: PAGINATION_FLIP_PAGE,
  target,
});

export const listStartCompare = unitId => ({
  type: LIST_START_COMPARE,
  unitId,
});

export const listClearCompare = () => ({
  type: LIST_CLEAR_COMPARE,
});

export const dataLoadedSuccess = data => ({
  type: DATA_LOADED_SUCCESS,
  data,
});

export const dataLoadedFailure = error => ({
  type: DATA_LOADED_FAILURE,
  error,
});
