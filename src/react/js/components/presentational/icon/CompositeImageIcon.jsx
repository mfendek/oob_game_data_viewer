import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { getImgUrl, getBackgroundImg } from '../../../utils/ImagePath';
import { getUrlWithParams } from '../../../utils/UrlParams';

/**
 * Composite image icon
 *
 * @param {Object} data
 * @param {function} lookup
 * @constructor
 */
const CompositeImageIcon = ({ data, lookup }) => {
  // compose background image
  const style = getBackgroundImg('switch_action', data.img);
  if (data.inner) {
    style.backgroundImage = 'url("'.concat(
      getImgUrl('weapon_ability', data.action),
      '"), url("',
      getImgUrl('switch_action', data.img), '")',
    );
  }

  // create tooltip text
  const title = (data.id > -1)
    ? 'unit may switch to '.concat(lookup(data.id, 'name_real'), ' using ', data.action, ' action')
    : 'unit may switch to '.concat(data.name, ' using ', data.action, ' action (switch unit missing)');

  // create switch unit link
  const link = (data.id > -1)
    ? <a className="unit-item__image-link" href={getUrlWithParams({ f: { id: data.id } })} /> : '';

  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip">{title}</Tooltip>}>
      <div
        className="unit-item__content-icon unit-item__content-icon--square-small"
        style={style}
      >
        {link}
      </div>
    </OverlayTrigger>
  );
};

CompositeImageIcon.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
  }).isRequired,
  lookup: PropTypes.func.isRequired,
};

export default CompositeImageIcon;
