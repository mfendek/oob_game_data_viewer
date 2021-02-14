import React from 'react';
import PropTypes from 'prop-types';
import { getUrlWithParams } from '../../../utils/UrlParams';
import { getBackgroundImg } from '../../../utils/ImagePath';

/**
 * Link icon
 *
 * @param {string} title
 * @param {string} link
 * @param {string} imgName
 * @param {string} imgValue
 * @constructor
 */
const LinkIcon = ({
  title, imgName, imgValue, link,
}) => (
  <div data-tip={title}>
    <div
      className="unit-item__content-icon unit-item__content-icon--rectangle-small"
      style={getBackgroundImg(imgName, imgValue)}
    >
      {
        link !== ''
        && (
          <a
            className="unit-item__image-link"
            href={getUrlWithParams({ f: { id: link } })}
            aria-label={title}
          />
        )
      }
    </div>
  </div>
);

LinkIcon.propTypes = {
  title: PropTypes.string.isRequired,
  imgName: PropTypes.string.isRequired,
  imgValue: PropTypes.string.isRequired,
  link: PropTypes.string,
};

LinkIcon.defaultProps = {
  link: '',
};

export default LinkIcon;
