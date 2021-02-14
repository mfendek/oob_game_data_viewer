import UnitNavigator from './UnitNavigator';
import { getNumberOfPages, getFilteredList } from '../../../utils/ListManipulation';
import { sanitizeData } from '../../../utils/DataCache';
import {
  FILTERS_SELECT_FILTER,
  FILTERS_CLEAR_FILTERS,
  PAGINATION_FLIP_PAGE,
  LIST_START_COMPARE,
  LIST_CLEAR_COMPARE,
  DATA_LOAD_SUCCESS,
  DATA_LOAD_FAILURE,
  DATA_LOAD_PROGRESS,
  MOD_LOADER_TOGGLE_LOG,
  MOD_LOADER_UPDATE_URL,
  MOD_LOADER_START,
} from './actions';

const reducerUnitNavigator = (state = UnitNavigator.initialState(), action) => {
  let filters;
  let pagination;

  switch (action.type) {
    case FILTERS_SELECT_FILTER: {
      const { name, e: { target: { value } } } = action;

      // remove unnecessary whitespace
      const cleanValue = (typeof value === 'string' && name !== 'name') ? value.trim() : value;

      filters = { ...state.filters };
      filters[name].value = cleanValue;

      pagination = { ...state.pagination };
      pagination.currentPage = 1;

      return {
        ...state,
        filters,
        pagination,
      };
    }
    case FILTERS_CLEAR_FILTERS: {
      filters = { ...state.filters };
      const types = Object.keys(filters);
      for (let i = 0; i < types.length; i += 1) {
        const name = types[i];
        filters[name].value = '';
      }

      pagination = { ...state.pagination };
      pagination.currentPage = 1;

      return {
        ...state,
        filters,
        pagination,
      };
    }
    case PAGINATION_FLIP_PAGE: {
      const { target } = action;
      pagination = { ...state.pagination };
      const list = getFilteredList(
        state.unitsData,
        state.unitsList,
        state.filters,
      );

      const pagesTotal = getNumberOfPages(list, pagination.itemsPerPage);

      if (target === 'first') {
        if (pagination.currentPage === 1 || pagesTotal === 0) {
          return state;
        }

        pagination.currentPage = 1;
      } else if (target === 'previous') {
        if (pagination.currentPage <= 1 || pagesTotal === 0) {
          return state;
        }

        pagination.currentPage -= 1;
      } else if (target === 'next') {
        if (pagination.currentPage >= pagesTotal || pagesTotal === 0) {
          return state;
        }

        pagination.currentPage += 1;
      } else if (target === 'last') {
        if (pagination.currentPage === pagesTotal || pagesTotal === 0) {
          return state;
        }

        pagination.currentPage = pagesTotal;
      }

      return {
        ...state,
        pagination,
      };
    }
    case LIST_START_COMPARE:
      return {
        ...state,
        compareId: action.unitId,
      };
    case LIST_CLEAR_COMPARE:
      return {
        ...state,
        compareId: -1,
      };
    case DATA_LOAD_PROGRESS:
      return {
        ...state,
        loadProgress: action.progress,
      };
    case DATA_LOAD_SUCCESS: {
      const data = {
        ...state,
        ...action.data,
      };

      return {
        ...sanitizeData(data),
        dataLoaded: true,
      };
    }
    case DATA_LOAD_FAILURE:
      return {
        ...state,
        loadFailure: true,
        errorMessage: action.error,
      };
    case MOD_LOADER_TOGGLE_LOG: {
      const modShowLog = !state.modShowLog;

      return {
        ...state,
        modShowLog,
      };
    }
    case MOD_LOADER_UPDATE_URL: {
      const { e: { target: { value: modUrl } } } = action;

      return {
        ...state,
        modUrl,
      };
    }
    case MOD_LOADER_START: {
      return {
        ...state,
        dataLoaded: false,
        loadProgress: 0,
      };
    }
    default:
      return state;
  }
};

export default reducerUnitNavigator;
