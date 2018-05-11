import React from 'react';
import PropTypes from 'prop-types';
import UrlParams from '../../utils/UrlParams';
import DropDownFilter from './DropDownFilter';
import TextInputFilter from './TextInputFilter';
import DateInputFilter from './DateInputFilter';

/**
 * Filter bar
 *
 * @param {Object} filters
 * @param {function} selectFilter
 * @param {function} clearFilters
 * @param {function} clearCompare
 * @param {number} compareId
 * @param {string} compareName
 * @constructor
 */
const FilterBar = (
  { filters, selectFilter, clearFilters, clearCompare, compareId, compareName },
  ) => (
    <div className="filter-bar">
      {
        Object.keys(filters).map((filterName) => {
          if (filters[filterName].type === 'drop-down') {
            // drop down filter
            return (<DropDownFilter
              key={filterName}
              name={filterName}
              label={filters[filterName].label}
              value={filters[filterName].value}
              list={filters[filterName].list}
              selectFilter={selectFilter}
            />);
          }

          if (filters[filterName].type === 'text') {
            // text input filter
            return (<TextInputFilter
              key={filterName}
              name={filterName}
              label={filters[filterName].label}
              value={filters[filterName].value}
              selectFilter={selectFilter}
            />);
          }

          if (filters[filterName].type === 'date') {
            // date input filter
            return (<DateInputFilter
              key={filterName}
              name={filterName}
              value={filters[filterName].value}
              min={filters[filterName].min}
              max={filters[filterName].max}
              selectFilter={selectFilter}
            />);
          }

          return '';
        })
      }

      <button
        type="button"
        name="clear-filters"
        className="btn btn-info"
        onClick={clearFilters}
      >
        Clear filters
      </button>

      {
        (compareId > -1)
          ?
            <button
              type="button"
              name="clear-compare"
              className="btn btn-warning"
              onClick={clearCompare}
            >
              Clear compare
            </button>
          : ''
      }

      {
        (compareId > -1)
          ?
            <a
              className="compare-label"
              href={UrlParams.getUrlWithParams({ f: { id: compareId } })}
            >
              {compareName}
            </a>
          : ''

      }
    </div>
);

FilterBar.propTypes = {
  filters: PropTypes.object.isRequired,
  selectFilter: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
  clearCompare: PropTypes.func.isRequired,
  compareId: PropTypes.number.isRequired,
  compareName: PropTypes.string.isRequired,
};

export default FilterBar;
