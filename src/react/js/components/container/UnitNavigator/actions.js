import axios from 'axios';
import { getLocalState } from '../../../utils/ReduxState';
import { isUrlValid, queryString } from '../../../utils/UrlParams';

export const FILTERS_SELECT_FILTER = 'FILTERS_SELECT_FILTER';
export const FILTERS_CLEAR_FILTERS = 'FILTERS_CLEAR_FILTERS';
export const PAGINATION_FLIP_PAGE = 'PAGINATION_FLIP_PAGE';
export const LIST_START_COMPARE = 'LIST_START_COMPARE';
export const LIST_CLEAR_COMPARE = 'LIST_CLEAR_COMPARE';
export const DATA_LOAD_PROGRESS = 'DATA_LOAD_PROGRESS';
export const DATA_LOAD_SUCCESS = 'DATA_LOAD_SUCCESS';
export const DATA_LOAD_FAILURE = 'DATA_LOAD_FAILURE';
export const MOD_LOADER_TOGGLE_LOG = 'MOD_LOADER_TOGGLE_LOG';
export const MOD_LOADER_UPDATE_URL = 'MOD_LOADER_UPDATE_URL';
export const MOD_LOADER_START = 'MOD_LOADER_START';

export const filtersSelectFilter = (name, e) => ({
  type: FILTERS_SELECT_FILTER,
  name,
  e,
});

export const filtersClearFilters = () => ({
  type: FILTERS_CLEAR_FILTERS,
});

export const paginationFlipPage = (target) => ({
  type: PAGINATION_FLIP_PAGE,
  target,
});

export const listStartCompare = (unitId) => ({
  type: LIST_START_COMPARE,
  unitId,
});

export const listClearCompare = () => ({
  type: LIST_CLEAR_COMPARE,
});

export const dataLoadProgress = (progress) => ({
  type: DATA_LOAD_PROGRESS,
  progress,
});

export const dataLoadSuccess = (data) => ({
  type: DATA_LOAD_SUCCESS,
  data,
});

export const dataLoadFailure = (error) => ({
  type: DATA_LOAD_FAILURE,
  error,
});

export const modLoaderToggleLog = () => ({
  type: MOD_LOADER_TOGGLE_LOG,
});

export const modLoaderUpdateUrl = (e) => ({
  type: MOD_LOADER_UPDATE_URL,
  e,
});

export const modLoaderStart = () => ({
  type: MOD_LOADER_START,
});

export function modLoadInit() {
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

    dispatch(modLoaderStart());

    // fetch fresh data with modded files
    axios.get(queryString({ 'units-data': 1, mod: modUrl }))
      .then((result) => {
        dispatch(dataLoadSuccess(result.data));
      })
      .catch((error) => {
        dispatch(dataLoadFailure(error));
      });
  };
}
