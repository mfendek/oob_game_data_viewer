import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { getUrlWithParams } from '../../../utils/UrlParams';

/**
 * Link label
 *
 * @param {string} color
 * @param {string} title
 * @param {string} altTitle
 * @param {Object} data
 * @param {function} lookup
 * @constructor
 */
const LinkLabel = ({
  color, data, lookup, title, altTitle,
}) => {
  const realName = (data.id > -1) ? lookup(data.id, 'name_real') : '';
  const titleParsed = (data.id > -1) ? title.replace('$s', realName) : altTitle;

  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip">{titleParsed}</Tooltip>}>
      <div className={'unit-item__label-'.concat(color)}>
        {(data.id > -1)
          ? <a href={getUrlWithParams({ f: { id: data.id } })}>{realName}</a>
          : <span>{data.name}</span>}
      </div>
    </OverlayTrigger>
  );
};

LinkLabel.propTypes = {
  color: PropTypes.oneOf(['green', 'red', 'gray']).isRequired,
  title: PropTypes.string.isRequired,
  altTitle: PropTypes.string.isRequired,
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  lookup: PropTypes.func.isRequired,
};

export default LinkLabel;
