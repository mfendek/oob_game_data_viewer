import React from 'react';
import PropTypes from 'prop-types';

/**
 * Mod loader
 *
 * @param {string} url
 * @param {function} updateUrl
 * @param {function} loadMod
 * @constructor
 */
const ModLoader = ({ url, updateUrl, loadMod }) => (
  <div className="mod-bar">
    <input
      type="url"
      name="mod-url"
      className="form-control"
      value={url}
      onChange={e => updateUrl(e)}
      placeholder="Mod url"
    />
    <button
      type="button"
      name="mod-load"
      className="btn btn-info"
      onClick={() => loadMod()}
    >
      Load mod
    </button>
  </div>
);

ModLoader.propTypes = {
  url: PropTypes.string.isRequired,
  updateUrl: PropTypes.func.isRequired,
  loadMod: PropTypes.func.isRequired,
};

export default ModLoader;
