import React from 'react';
import PropTypes from 'prop-types';

/**
 * Mod loader
 *
 * @param {string} url
 * @param {boolean} showLog
 * @param {array} files
 * @param {function} updateUrl
 * @param {function} loadMod
 * @param {function} toggleLog
 * @constructor
 */
const ModLoader = ({ url, showLog, files, updateUrl, loadMod, toggleLog }) => (
  <div className="mod-bar">
    <div className="mod-bar__loader">
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
        className="btn btn-primary"
        onClick={() => loadMod()}
      >
        Load mod
      </button>
      <button
        type="button"
        name="mod-files"
        className="btn btn-warning"
        onClick={() => toggleLog()}
      >
        {(showLog) ? 'Hide log' : 'Show log'}
      </button>
    </div>
    {showLog &&
      <div className="mod-bar__log">
        {files.length > 0 &&
          <ul>
            {
              files.map(
                modFile => (
                  <li key={modFile}>{modFile}</li>
                ),
              )
            }
          </ul>
        }
        {files.length === 0 &&
          <p>No mod files in use</p>
        }
      </div>
    }
  </div>
);

ModLoader.propTypes = {
  url: PropTypes.string.isRequired,
  showLog: PropTypes.bool.isRequired,
  files: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateUrl: PropTypes.func.isRequired,
  loadMod: PropTypes.func.isRequired,
  toggleLog: PropTypes.func.isRequired,
};

export default ModLoader;
