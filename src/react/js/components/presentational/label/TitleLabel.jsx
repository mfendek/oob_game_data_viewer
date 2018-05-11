import React from 'react';
import PropTypes from 'prop-types';
import UrlParams from '../../utils/UrlParams';

/**
 * Title label
 *
 * @param {Object} data
 * @constructor
 */
const TitleLabel = ({ data }) => (
  <div className="unit-item__detail-title">
    <a href={UrlParams.getUrlWithParams({ f: { id: data.id } })}>{data.name_real.concat(' (', data.id, ')')}</a>
  </div>
);

TitleLabel.propTypes = {
  data: PropTypes.object.isRequired,
};

export default TitleLabel;
