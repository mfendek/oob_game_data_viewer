import React from 'react';
import PropTypes from 'prop-types';
import { getUrlWithParams } from '../../../utils/UrlParams';

/**
 * Title label
 *
 * @param {Object} data
 * @constructor
 */
const TitleLabel = ({ data }) => (
  <div className="unit-item__detail-title">
    <a href={getUrlWithParams({ f: { id: data.id } })}>{data.name_real.concat(' (', data.id, ')')}</a>
  </div>
);

TitleLabel.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name_real: PropTypes.string.isRequired,
  }).isRequired,
};

export default TitleLabel;
