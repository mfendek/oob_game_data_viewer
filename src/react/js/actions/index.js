import axios from 'axios';
import { getLocalState } from '../utils/ReduxState';
import { isUrlValid, queryString } from '../utils/UrlParams';

export const LIST_TOGGLE_TERRAIN = 'LIST_TOGGLE_TERRAIN';
export const FILTERS_SELECT_FILTER = 'FILTERS_SELECT_FILTER';
export const FILTERS_CLEAR_FILTERS = 'FILTERS_CLEAR_FILTERS';
export const PAGINATION_FLIP_PAGE = 'PAGINATION_FLIP_PAGE';
export const LIST_START_COMPARE = 'LIST_START_COMPARE';
export const LIST_CLEAR_COMPARE = 'LIST_CLEAR_COMPARE';
export const DATA_LOADED_SUCCESS = 'DATA_LOADED_SUCCESS';
export const DATA_LOADED_FAILURE = 'DATA_LOADED_FAILURE';
export const MOD_TOGGLE_LOG = 'MOD_TOGGLE_LOG';
export const MOD_UPDATE_URL = 'MOD_UPDATE_URL';
export const MOD_LOAD_START = 'MOD_LOAD_START';

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

export const modToggleLog = () => ({
  type: MOD_TOGGLE_LOG,
});

export const modUpdateUrl = e => ({
  type: MOD_UPDATE_URL,
  e,
});

export const modLoadStart = () => ({
  type: MOD_LOAD_START,
});

export function modLoad() {
  return (dispatch, getState) => {
    const globalState = getState();
    const state = getLocalState(globalState, 'reducerUnitNavigator');
    const { modUrl } = state;
    if (modUrl === '') {
      return;
    }

    if (!isUrlValid(modUrl)) {
      return;
    }

    dispatch(modLoadStart());

    // fetch fresh data with modded files
    axios.get(queryString({ 'units-data': 1, mod: modUrl }))
      .then((result) => {
        dispatch(dataLoadedSuccess(result.data));
      })
      .catch((error) => {
        dispatch(dataLoadedFailure(error));
      });
  };
}
