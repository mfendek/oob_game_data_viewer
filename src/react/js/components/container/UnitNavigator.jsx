import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import DataCache from '../utils/DataCache';
import UrlParams from '../utils/UrlParams';
import ListManipulation from '../utils/ListManipulation';
import ItemList from './ItemList';
import FilterBar from '../presentational/filter/FilterBar';
import PaginationBar from '../presentational/PaginationBar';

/**
 * Unit navigator
 */
class UnitNavigator extends Component {
  /**
   * @param props
   * @constructor
   */
  constructor(props) {
    super(props);

    // initialise data
    this.state = {
      ...this.props.data,
      dataLoaded: false,
      loadFailure: false,
      errorMessage: '',
      unitsData: {},
    };

    // attempt to load data from cache
    const cacheKey = this.getCacheKey('unit-nav');
    const cachedData = DataCache.getCachedItem(cacheKey);
    if (cachedData !== null) {
      // data is cached - use it
      const data = JSON.parse(cachedData);
      const { filtersInit } = this.props.data;

      // add initial filter values to filter data
      const filterKeys = Object.keys(filtersInit);
      if (filterKeys.length > 0) {
        for (let i = 0; i < filterKeys.length; i += 1) {
          const filterName = filterKeys[i];
          data.filters[filterName].value = filtersInit[filterName];
        }
      }

      this.state = {
        ...this.state,
        ...data,
        dataLoaded: true,
      };

      // validate current page
      const pagesTotal = this.getPagesTotal();
      this.state.pagination.currentPage = Math.min(this.state.pagination.currentPage, pagesTotal);

      // validate compare id
      const { unitsList, compareId } = this.state;
      if (unitsList.indexOf(compareId) < 0) {
        this.state.compareId = -1;
      }
    }

    this.selectFilter = this.selectFilter.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    this.getCacheKey = this.getCacheKey.bind(this);
    this.flipPage = this.flipPage.bind(this);
    this.getPagesTotal = this.getPagesTotal.bind(this);
    this.startCompare = this.startCompare.bind(this);
    this.clearCompare = this.clearCompare.bind(this);
  }

  componentDidMount() {
    // data is already loaded from cache
    if (this.state.dataLoaded) {
      return;
    }

    // clear local storage
    localStorage.clear();

    // fetch fresh data
    axios.get('?units-data=1')
      .then((result) => {
        const data = result.data;
        const { filtersInit } = this.state;

        // add initial filter values to filter data
        const filterKeys = Object.keys(filtersInit);
        if (filterKeys.length > 0) {
          for (let i = 0; i < filterKeys.length; i += 1) {
            const filterName = filterKeys[i];
            data.filters[filterName].value = filtersInit[filterName];
          }
        }

        this.setState({
          ...data,
          dataLoaded: true,
        });

        // store unit data for future use
        const cacheKey = this.getCacheKey('unit-nav');
        DataCache.setCachedItem(cacheKey, JSON.stringify(data));
      })
      .catch((error) => {
        this.setState({
          loadFailure: true,
          errorMessage: error,
        });
      });
  }

  /**
   * @param {string} key
   * @returns {string}
   */
  getCacheKey(key) {
    return this.state.appVersion.concat('_', key);
  }

  /**
   * @returns {number}
   */
  getPagesTotal() {
    const list = ListManipulation.getFilteredList(
      this.state.unitsData,
      this.state.unitsList,
      this.state.filters,
    );

    return ListManipulation.getNumberOfPages(list, this.state.pagination.itemsPerPage);
  }

  /**
   * Select specified filter
   *
   * @param {string} name
   * @param {Object} e
   */
  selectFilter(name, e) {
    let value = e.target.value;

    // remove unnecessary whitespace
    value = (typeof value === 'string') ? value.trim() : value;

    const filters = this.state.filters;
    filters[name].value = value;

    const pagination = this.state.pagination;
    pagination.currentPage = 1;

    this.setState({ filters, pagination });
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    const filters = this.state.filters;
    const types = Object.keys(filters);
    for (let i = 0; i < types.length; i += 1) {
      const name = types[i];
      filters[name].value = '';
    }

    const pagination = this.state.pagination;
    pagination.currentPage = 1;

    this.setState({ filters, pagination });
  }

  /**
   * @param {string} target
   */
  flipPage(target) {
    const pagination = this.state.pagination;
    const pagesTotal = this.getPagesTotal();

    if (target === 'first') {
      if (pagination.currentPage === 1 || pagesTotal === 0) {
        return;
      }

      pagination.currentPage = 1;
    } else if (target === 'previous') {
      if (pagination.currentPage <= 1 || pagesTotal === 0) {
        return;
      }

      pagination.currentPage -= 1;
    } else if (target === 'next') {
      if (pagination.currentPage >= pagesTotal || pagesTotal === 0) {
        return;
      }

      pagination.currentPage += 1;
    } else if (target === 'last') {
      if (pagination.currentPage === pagesTotal || pagesTotal === 0) {
        return;
      }

      pagination.currentPage = pagesTotal;
    }

    this.setState({ pagination });
  }

  /**
   * Activate compare mode
   *
   * @param {number} unitId
   */
  startCompare(unitId) {
    this.setState({ compareId: unitId });
  }

  /**
   * Deactivate compare mode
   */
  clearCompare() {
    this.setState({ compareId: -1 });
  }

  /**
   * Generate permalink based on current filters and page
   */
  generatePermalink() {
    const active = {};
    const currentPage = this.state.pagination.currentPage;
    const filters = this.state.filters;
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

    if (this.state.compareId > -1) {
      params.c = this.state.compareId;
    }

    return UrlParams.getUrlWithParams(params);
  }

  render() {
    // failed to load data
    if (this.state.loadFailure) {
      return (
        <div className="text-center">Failed to load units data {this.state.errorMessage}</div>
      );
    }

    // data is not loaded yet - display loading screen
    if (!this.state.dataLoaded) {
      return (
        <div id="spinner" className="spinner">
          <img src="src/img/spinner.gif" alt="spinner" />
        </div>
      );
    }

    const pagesTotal = this.getPagesTotal();
    const permalink = this.generatePermalink();
    const compareId = this.state.compareId;

    // display the app
    return (
      <div>
        <FilterBar
          filters={this.state.filters}
          selectFilter={this.selectFilter}
          clearFilters={this.clearFilters}
          clearCompare={this.clearCompare}
          compareId={compareId}
          compareName={(compareId > -1) ? this.state.unitsData[compareId].name_real : ''}
        />

        <PaginationBar
          currentPage={this.state.pagination.currentPage}
          pagesTotal={pagesTotal}
          permalink={permalink}
          flipPage={this.flipPage}
        />

        <ItemList
          unitsData={this.state.unitsData}
          unitsList={this.state.unitsList}
          terrain={this.state.terrain}
          pagination={this.state.pagination}
          filters={this.state.filters}
          compareId={this.state.compareId}
          startCompare={this.startCompare}
          appVersion={this.state.appVersion}
        />

        <PaginationBar
          currentPage={this.state.pagination.currentPage}
          pagesTotal={pagesTotal}
          permalink={permalink}
          flipPage={this.flipPage}
        />
      </div>
    );
  }
}

UnitNavigator.propTypes = {
  data: PropTypes.shape({
    appVersion: PropTypes.string.isRequired,
    compareId: PropTypes.number.isRequired,
    pagination: PropTypes.shape({
      currentPage: PropTypes.number.isRequired,
      itemsPerPage: PropTypes.number.isRequired,
    }).isRequired,
    filtersInit: PropTypes.object.isRequired,
  }).isRequired,
};

export default UnitNavigator;
