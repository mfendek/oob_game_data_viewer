import React from 'react';
import PropTypes from 'prop-types';

/**
 * Date input filter
 *
 * @param {string} name
 * @param {string|number} value
 * @param {string} min
 * @param {string} max
 * @param {function} selectFilter
 * @constructor
 */
const DateInputFilter = ({ name, value, min, max, selectFilter }) => (
  <input
    type="date"
    name={'filter-'.concat(name)}
    className="form-control"
    value={value}
    onChange={(e) => { selectFilter(name, e); }}
    min={min}
    max={max}
  />
);

DateInputFilter.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  min: PropTypes.string.isRequired,
  max: PropTypes.string.isRequired,
  selectFilter: PropTypes.func.isRequired,
};

export default DateInputFilter;
