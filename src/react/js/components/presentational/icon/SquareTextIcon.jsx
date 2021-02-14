import React from 'react';
import PropTypes from 'prop-types';
import { getBackgroundImg } from '../../../utils/ImagePath';
import ComparisonText from './ComparisonText';

/**
 * Square text icon
 *
 * @param {string} name
 * @param {number} value
 * @param {string} title
 * @param {function} compare
 * @param {string} imgName
 * @param {string} imgValue
 * @param {bool} reversedCompare
 * @param {bool} breakLine
 * @constructor
 */
const SquareTextIcon = (
  {
    name, value, title, compare, imgName, imgValue, reversedCompare, breakLine,
  },
) => (
  <div data-tip={title}>
    <div
      className={
        'unit-item__content-icon unit-item__content-icon--square-small unit-item__content-icon--text-center'.concat(
          (breakLine) ? ' change-break-line' : '',
        )
      }
      style={getBackgroundImg((imgName !== '' ? imgName : name), (imgValue !== '' ? imgValue : value))}
    >
      <ComparisonText
        base={compare(name)}
        value={value}
        reversed={reversedCompare}
      />
    </div>
  </div>
);

SquareTextIcon.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  compare: PropTypes.func.isRequired,
  imgName: PropTypes.string,
  imgValue: PropTypes.string,
  reversedCompare: PropTypes.bool,
  breakLine: PropTypes.bool,
};

SquareTextIcon.defaultProps = {
  imgName: '',
  imgValue: '',
  reversedCompare: false,
  breakLine: false,
};

export default SquareTextIcon;
