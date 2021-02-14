import React from 'react';
import PropTypes from 'prop-types';

/**
 * Text label
 *
 * @param {string} color
 * @param {string} text
 * @param {string} title
 * @constructor
 */
const TextLabel = ({ color, text, title }) => (
  <div data-tip={title}>
    <div className={'unit-item__label-'.concat(color)}>{text}</div>
  </div>
);

TextLabel.propTypes = {
  color: PropTypes.oneOf(['green', 'red', 'gray']).isRequired,
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default TextLabel;
