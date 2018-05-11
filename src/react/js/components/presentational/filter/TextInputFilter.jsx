import React from 'react';
import PropTypes from 'prop-types';

/**
 * Text input filter
 *
 * @param {string} name
 * @param {string} label
 * @param {string|number} value
 * @param {function} selectFilter
 * @constructor
 */
const TextInputFilter = ({ name, label, value, selectFilter }) => (
  <input
    type="text"
    name={'filter-'.concat(name)}
    className="form-control"
    value={value}
    onChange={(e) => { selectFilter(name, e); }}
    placeholder={label}
  />
);

TextInputFilter.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  selectFilter: PropTypes.func.isRequired,
};

export default TextInputFilter;
