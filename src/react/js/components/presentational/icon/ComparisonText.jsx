import React from 'react';
import PropTypes from 'prop-types';

/**
 * Comparison text
 *
 * used inside icons to highlight difference
 *
 * @param {Object} base
 * @param {number} value
 * @param {bool} reversed
 * @constructor
 */
const ComparisonText = ({ base, value, reversed }) => {
  const { compareId, baseValue } = base;

  // nothing to compare
  if (compareId < 0) {
    return <span>{value}</span>;
  }

  // determine if change needs to be highlighted
  if (baseValue > value) {
    const diff = baseValue - value;

    return (
      <span className={(reversed) ? 'positive-change' : 'negative-change'}>
        <span>{value}</span>
        <span>{' -'.concat(diff.toString())}</span>
      </span>
    );
  }

  if (baseValue < value) {
    const diff = value - baseValue;

    return (
      <span className={(reversed) ? 'negative-change' : 'positive-change'}>
        <span>{value}</span>
        <span>{' +'.concat(diff.toString())}</span>
      </span>
    );
  }

  return <span>{value}</span>;
};

ComparisonText.propTypes = {
  base: PropTypes.shape({
    compareId: PropTypes.number.isRequired,
    baseValue: PropTypes.number.isRequired,
  }).isRequired,
  value: PropTypes.number.isRequired,
  reversed: PropTypes.bool.isRequired,
};

export default ComparisonText;
