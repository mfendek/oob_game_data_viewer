import UnitNavigator from '../components/container/UnitNavigator';
import { getNumberOfPages, getFilteredList } from '../utils/ListManipulation';
import { sanitizeData } from '../utils/DataCache';
import {
  FILTERS_SELECT_FILTER,
  FILTERS_CLEAR_FILTERS,
  PAGINATION_FLIP_PAGE,
  LIST_START_COMPARE,
  LIST_CLEAR_COMPARE,
  DATA_LOADED_SUCCESS,
  DATA_LOADED_FAILURE,
  MOD_TOGGLE_LOG,
  MOD_UPDATE_URL,
  MOD_LOAD_START,
} from '../actions';

const reducerUnitNavigator = (state = UnitNavigator.initialState(), action) => {
  let filters;
  let pagination;

  switch (action.type) {
    case FILTERS_SELECT_FILTER: {
      const name = action.name;
      const e = action.e;

      let value = e.target.value;

      // remove unnecessary whitespace
      value = (typeof value === 'string' && name !== 'name') ? value.trim() : value;

      filters = { ...state.filters };
      filters[name].value = value;

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
      const target = action.target;
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
    case DATA_LOADED_SUCCESS: {
      const data = {
        ...state,
        ...action.data,
      };

      return {
        ...sanitizeData(data),
        dataLoaded: true,
      };
    }
    case DATA_LOADED_FAILURE:
      return {
        ...state,
        loadFailure: true,
        errorMessage: action.error,
      };
    case MOD_TOGGLE_LOG: {
      const modShowLog = !state.modShowLog;

      return {
        ...state,
        modShowLog,
      };
    }
    case MOD_UPDATE_URL: {
      const e = action.e;
      const modUrl = e.target.value;

      return {
        ...state,
        modUrl,
      };
    }
    case MOD_LOAD_START: {
      return {
        ...state,
        dataLoaded: false,
      };
    }
    default:
      return state;
  }
};

export default reducerUnitNavigator;
