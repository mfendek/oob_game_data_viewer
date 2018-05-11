import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import ImagePath from '../../utils/ImagePath';
import ComparisonText from './ComparisonText';

/**
 * Rectangle text icon
 *
 * @param {string} name
 * @param {number} value
 * @param {string} title
 * @param {function} compare
 * @param {string} imgName
 * @param {string} imgValue
 * @param {bool} reversedCompare
 * @param {bool} allowZeroValue
 * @constructor
 */
const RectangleTextIcon = (
    { name, value, title, compare, imgName, imgValue, reversedCompare, allowZeroValue },
  ) => {
  if (!allowZeroValue && value === 0) {
    return '';
  }

  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip">{title}</Tooltip>}>
      <div
        className="unit-item__content-icon
           unit-item__content-icon--rectangle-large
            unit-item__content-icon--text-stat"
        style={ImagePath.getBackgroundImg(imgName, imgValue)}
      >
        <ComparisonText
          base={compare(name)}
          value={value}
          reversed={reversedCompare}
        />
      </div>
    </OverlayTrigger>
  );
};

RectangleTextIcon.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  compare: PropTypes.func.isRequired,
  imgName: PropTypes.string.isRequired,
  imgValue: PropTypes.string.isRequired,
  reversedCompare: PropTypes.bool,
  allowZeroValue: PropTypes.bool,
};

RectangleTextIcon.defaultProps = {
  reversedCompare: false,
  allowZeroValue: true,
};

export default RectangleTextIcon;
