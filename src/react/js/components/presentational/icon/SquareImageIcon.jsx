import React from 'react';
import PropTypes from 'prop-types';
import { getBackgroundImg } from '../../../utils/ImagePath';

/**
 * Square image icon
 *
 * @param {string} name
 * @param {string} value
 * @param {string} title
 * @constructor
 */
const SquareImageIcon = ({ name, value, title }) => {
  if (value === '') {
    return '';
  }

  return (
    <div data-tip={title}>
      <div
        className="unit-item__content-icon unit-item__content-icon--square-small"
        style={getBackgroundImg(name, value)}
      />
    </div>
  );
};

SquareImageIcon.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default SquareImageIcon;
