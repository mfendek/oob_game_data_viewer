import React from 'react';
import PropTypes from 'prop-types';

/**
 * Drop down filter
 *
 * @param {string} name
 * @param {string} label
 * @param {string|number} value
 * @param {string[]} list
 * @param {function} selectFilter
 * @constructor
 */
const DropDownFilter = ({ name, label, value, list, selectFilter }) => (
  <select
    name={'filter-'.concat(name)}
    className="form-control"
    value={value}
    onChange={(e) => { selectFilter(name, e); }}
  >
    <option key="" value="">{label}</option>
    {
      list.map(
        currentValue => <option key={currentValue} value={currentValue}>{currentValue}</option>,
      )
    }
  </select>
);

DropDownFilter.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  list: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectFilter: PropTypes.func.isRequired,
};

export default DropDownFilter;
