import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { getCachedItem, setCachedItem, getCacheKey, sanitizeData } from '../../utils/DataCache';
import { generatePermalink } from '../../utils/UrlParams';
import { getNumberOfPages, getFilteredList } from '../../utils/ListManipulation';
import { getLocalState } from '../../utils/ReduxState';
import ItemList from './ItemList';
import FilterBar from '../presentational/filter/FilterBar';
import PaginationBar from '../presentational/PaginationBar';
import {
  filtersSelectFilter,
  filtersClearFilters,
  paginationFlipPage,
  listStartCompare,
  listClearCompare,
  dataLoadedSuccess,
  dataLoadedFailure,
} from '../../actions';

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
      errorMessage: '',
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
    // data is already loaded - no need to fetch fresh data
    if (this.props.dataLoaded) {
      return;
    }

    const cacheKey = getCacheKey(this.props.appVersion, 'unit-nav');

    // clear local storage
    localStorage.clear();

    // fetch fresh data
    axios.get('?units-data=1')
      .then((result) => {
        this.props.dataLoadedSuccess(result.data);

        // store unit data for future use
        setCachedItem(cacheKey, JSON.stringify(result.data));
      })
      .catch((error) => {
        this.props.dataLoadedFailure(error);
      });
  }

  render() {
    // failed to load data
    if (this.props.loadFailure) {
      return (
        <div className="text-center">Failed to load units data {this.props.errorMessage}</div>
      );
    }

    // data is not loaded yet - display loading screen
    if (!this.props.dataLoaded) {
      return (
        <div id="spinner" className="spinner">
          <img src="src/img/spinner.gif" alt="spinner" />
        </div>
      );
    }

    const { filters, pagination, compareId, unitsData, unitsList } = this.props;

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
          selectFilter={this.props.selectFilter}
          clearFilters={this.props.clearFilters}
          clearCompare={this.props.clearCompare}
          compareId={compareId}
          compareName={(compareId > -1) ? unitsData[compareId].name_real : ''}
        />

        <PaginationBar
          currentPage={pagination.currentPage}
          pagesTotal={pagesTotal}
          permalink={permalink}
          flipPage={this.props.flipPage}
        />

        <ItemList
          unitsData={unitsData}
          unitsList={unitsList}
          terrain={this.props.terrain}
          pagination={pagination}
          filters={filters}
          compareId={compareId}
          startCompare={this.props.startCompare}
          imageKey={this.props.appVersion}
        />

        <PaginationBar
          currentPage={pagination.currentPage}
          pagesTotal={pagesTotal}
          permalink={permalink}
          flipPage={this.props.flipPage}
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
  dataLoadedSuccess: PropTypes.func.isRequired,
  dataLoadedFailure: PropTypes.func.isRequired,
  dataLoaded: PropTypes.bool,
  loadFailure: PropTypes.bool,
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
};

UnitNavigator.defaultProps = {
  dataLoaded: false,
  loadFailure: false,
  errorMessage: '',
  unitsData: {},
  unitsList: [],
  terrain: {},
  filters: {},
  pagination: {},
  compareId: -1,
  appVersion: '',
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
    errorMessage: state.errorMessage,
    dataLoaded: state.dataLoaded,
  };
};

const mapDispatchToProps = dispatch => ({
  selectFilter: (name, e) => dispatch(filtersSelectFilter(name, e)),
  clearFilters: () => dispatch(filtersClearFilters()),
  flipPage: target => dispatch(paginationFlipPage(target)),
  startCompare: unitId => dispatch(listStartCompare(unitId)),
  clearCompare: () => dispatch(listClearCompare()),
  dataLoadedSuccess: data => dispatch(dataLoadedSuccess(data)),
  dataLoadedFailure: error => dispatch(dataLoadedFailure(error)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UnitNavigator);
