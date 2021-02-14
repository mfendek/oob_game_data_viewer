import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Circle } from 'rc-progress';
import {
  getCachedItem, setCachedItem, getCacheKey, sanitizeData,
} from '../../../utils/DataCache';
import { queryString, generatePermalink } from '../../../utils/UrlParams';
import { getNumberOfPages, getFilteredList } from '../../../utils/ListManipulation';
import { getLocalState } from '../../../utils/ReduxState';
import ItemList from '../ItemList/ItemList';
import FilterBar from '../../presentational/filter/FilterBar';
import PaginationBar from '../../presentational/PaginationBar';
import ModLoader from '../../presentational/ModLoader';
import {
  filtersSelectFilter,
  filtersClearFilters,
  paginationFlipPage,
  listStartCompare,
  listClearCompare,
  dataLoadProgress,
  dataLoadSuccess,
  dataLoadFailure,
  modLoaderToggleLog,
  modLoaderUpdateUrl,
  modLoadInit,
} from './actions';

/**
 * Unit navigator
 */
class UnitNavigator extends Component {
  /**
   * @returns {Object}
   */
  static initialState() {
    const staticData = JSON.parse(document.getElementById('unit-navigator-data').innerHTML);
    const initialData = {
      ...staticData,
      dataLoaded: false,
      loadFailure: false,
      loadProgress: 0,
      errorMessage: '',
      modUrl: '',
      modFiles: [],
      modShowLog: false,
      unitsData: {},
    };

    // attempt to load data from cache
    const cacheKey = getCacheKey(initialData.appVersion, 'unit-nav');
    const cachedData = getCachedItem(cacheKey);
    if (cachedData !== null) {
      // data is cached - use it
      const data = {
        ...initialData,
        ...JSON.parse(cachedData),
      };

      return {
        ...sanitizeData(data),
        dataLoaded: true,
      };
    }

    return initialData;
  }

  componentDidMount() {
    const {
      dataLoaded, appVersion, dataLoadedProgress, dataLoadedSuccess, dataLoadedFailure,
    } = this.props;

    // data is already loaded - no need to fetch fresh data
    if (dataLoaded) {
      return;
    }

    const cacheKey = getCacheKey(appVersion, 'unit-nav');

    // clear local storage
    localStorage.clear();

    // fetch fresh data
    axios.get(queryString({ 'units-data': 1 }), {
      onDownloadProgress: (progressEvent) => {
        const loaded = parseInt(progressEvent.loaded, 10);
        const total = parseInt(progressEvent.total, 10);

        let progress = Math.round((loaded * 100) / total);
        progress = Math.max(0, progress);
        progress = Math.min(100, progress);

        dataLoadedProgress(progress);
      },
    })
      .then((result) => {
        dataLoadedSuccess(result.data);

        // store unit data for future use
        setCachedItem(cacheKey, JSON.stringify(result.data));
      })
      .catch((error) => {
        dataLoadedFailure(error);
      });
  }

  render() {
    const {
      loadFailure, errorMessage, dataLoaded, loadProgress,
    } = this.props;

    // failed to load data
    if (loadFailure) {
      return (
        <div className="text-center">
          Failed to load units data
          {errorMessage}
        </div>
      );
    }

    // data is not loaded yet - display loading screen
    if (!dataLoaded) {
      return loadProgress > 0
        ? (
          <div id="spinner" className="spinner">
            <Circle
              percent={loadProgress}
              strokeColor="#636363"
              strokeWidth="11"
              trailColor="#eaeaea"
              trailWidth="11"
            />
          </div>
        )
        : (
          <div id="spinner" className="spinner">
            <img src="src/img/spinner.gif" alt="spinner" />
          </div>
        );
    }

    const {
      filters,
      pagination,
      compareId,
      unitsData,
      unitsList,
      selectFilter,
      clearFilters,
      clearCompare,
      flipPage,
      terrain,
      startCompare,
      appVersion,
      modUrl,
      modShowLog,
      modFiles,
      modUpdateUrl,
      modLoad,
      modToggleLog,
    } = this.props;

    const list = getFilteredList(
      unitsData,
      unitsList,
      filters,
    );

    const pagesTotal = getNumberOfPages(list, pagination.itemsPerPage);
    const permalink = generatePermalink(pagination, filters, compareId);

    // display the app
    return (
      <div>
        <FilterBar
          filters={filters}
          selectFilter={selectFilter}
          clearFilters={clearFilters}
          clearCompare={clearCompare}
          compareId={compareId}
          compareName={(compareId > -1) ? unitsData[compareId].name_real : ''}
        />

        <PaginationBar
          currentPage={pagination.currentPage}
          pagesTotal={pagesTotal}
          permalink={permalink}
          flipPage={flipPage}
        />

        <ItemList
          unitsData={unitsData}
          unitsList={unitsList}
          terrain={terrain}
          pagination={pagination}
          filters={filters}
          compareId={compareId}
          startCompare={startCompare}
          imageKey={appVersion}
        />

        <PaginationBar
          currentPage={pagination.currentPage}
          pagesTotal={pagesTotal}
          permalink={permalink}
          flipPage={flipPage}
        />

        <ModLoader
          url={modUrl}
          showLog={modShowLog}
          files={modFiles}
          updateUrl={modUpdateUrl}
          loadMod={modLoad}
          toggleLog={modToggleLog}
        />
      </div>
    );
  }
}

UnitNavigator.propTypes = {
  selectFilter: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
  flipPage: PropTypes.func.isRequired,
  startCompare: PropTypes.func.isRequired,
  clearCompare: PropTypes.func.isRequired,
  modUpdateUrl: PropTypes.func.isRequired,
  modFiles: PropTypes.arrayOf(PropTypes.string).isRequired,
  modShowLog: PropTypes.bool.isRequired,
  modLoad: PropTypes.func.isRequired,
  modToggleLog: PropTypes.func.isRequired,
  dataLoadedProgress: PropTypes.func.isRequired,
  dataLoadedSuccess: PropTypes.func.isRequired,
  dataLoadedFailure: PropTypes.func.isRequired,
  dataLoaded: PropTypes.bool,
  loadFailure: PropTypes.bool,
  loadProgress: PropTypes.number,
  errorMessage: PropTypes.string,
  unitsData: PropTypes.objectOf(PropTypes.shape({
    id: PropTypes.number,
    chassis: PropTypes.string,
    category: PropTypes.string,
  })),
  unitsList: PropTypes.arrayOf(PropTypes.number),
  terrain: PropTypes.objectOf(PropTypes.objectOf(PropTypes.shape({
    movement: PropTypes.objectOf(PropTypes.shape({
      points: PropTypes.number,
      road_factor_dirt: PropTypes.number,
      road_factor_normal: PropTypes.number,
    })),
    spotting: PropTypes.objectOf(PropTypes.number),
  }))),
  pagination: PropTypes.shape({
    currentPage: PropTypes.number,
    itemsPerPage: PropTypes.number,
  }),
  filters: PropTypes.objectOf(PropTypes.shape({
    type: PropTypes.string,
    label: PropTypes.string,
  })),
  compareId: PropTypes.number,
  appVersion: PropTypes.string,
  modUrl: PropTypes.string,
};

UnitNavigator.defaultProps = {
  dataLoaded: false,
  loadFailure: false,
  loadProgress: 0,
  errorMessage: '',
  unitsData: {},
  unitsList: [],
  terrain: {},
  filters: {},
  pagination: {},
  compareId: -1,
  appVersion: '',
  modUrl: '',
};

const mapStateToProps = (globalState) => {
  const state = getLocalState(globalState, 'reducerUnitNavigator');

  return {
    pagination: state.pagination,
    filters: state.filters,
    unitsData: state.unitsData,
    unitsList: state.unitsList,
    terrain: state.terrain,
    compareId: state.compareId,
    appVersion: state.appVersion,
    loadFailure: state.loadFailure,
    loadProgress: state.loadProgress,
    errorMessage: state.errorMessage,
    dataLoaded: state.dataLoaded,
    modUrl: state.modUrl,
    modFiles: state.modFiles,
    modShowLog: state.modShowLog,
  };
};

const mapDispatchToProps = (dispatch) => ({
  selectFilter: (name, e) => dispatch(filtersSelectFilter(name, e)),
  clearFilters: () => dispatch(filtersClearFilters()),
  flipPage: (target) => dispatch(paginationFlipPage(target)),
  startCompare: (unitId) => dispatch(listStartCompare(unitId)),
  clearCompare: () => dispatch(listClearCompare()),
  dataLoadedProgress: (progress) => dispatch(dataLoadProgress(progress)),
  dataLoadedSuccess: (data) => dispatch(dataLoadSuccess(data)),
  dataLoadedFailure: (error) => dispatch(dataLoadFailure(error)),
  modToggleLog: () => dispatch(modLoaderToggleLog()),
  modUpdateUrl: (e) => dispatch(modLoaderUpdateUrl(e)),
  modLoad: () => dispatch(modLoadInit()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UnitNavigator);
