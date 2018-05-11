import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

/**
 * Text label
 *
 * @param {string} color
 * @param {string} text
 * @param {string} title
 * @constructor
 */
const TextLabel = ({ color, text, title }) => (
  <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip">{title}</Tooltip>}>
    <div className={'unit-item__label-'.concat(color)}>{text}</div>
  </OverlayTrigger>
);

TextLabel.propTypes = {
  color: PropTypes.oneOf(['green', 'red', 'gray']).isRequired,
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default TextLabel;
