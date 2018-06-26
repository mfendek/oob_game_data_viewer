import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getTerrainPoints } from '../../utils/GameMath';
import { getFilteredList } from '../../utils/ListManipulation';
import { getLocalState } from '../../utils/ReduxState';
import ItemDetail from '../presentational/ItemDetail';
import { listToggleTerrain } from '../../actions';

/**
 * Item list (filtering and pagination)
 *
 * @param {Object} unitsData
 * @param {Array} unitsList
 * @param {Object} terrain
 * @param {Object} pagination
 * @param {Object} filters
 * @param {function} startCompare
 * @param {string} imageKey
 * @param {function} isTerrainDisplayed
 * @param {function} compareUnitAttribute
 * @param {function} compareTerrainMovement
 * @param {function} compareTerrainSpotting
 * @param {function} findUnitProperty
 * @param {function} toggleTerrain
 * @constructor
 */
const ItemList = (
  {
    unitsData,
    unitsList,
    terrain,
    pagination,
    filters,
    startCompare,
    imageKey,
    isTerrainDisplayed,
    compareUnitAttribute,
    compareTerrainMovement,
    compareTerrainSpotting,
    findUnitProperty,
    toggleTerrain,
  }) => {
  const list = getFilteredList(
    unitsData,
    unitsList,
    filters,
  );

  const { currentPage, itemsPerPage } = pagination;
  const pageStart = (currentPage - 1) * itemsPerPage;
  const pageEnd = currentPage * itemsPerPage;

  return (
    <div className="units-list">
      {
        list.slice(pageStart, pageEnd).map(
          unitId => (
            <ItemDetail
              key={unitId}
              data={unitsData[unitId]}
              terrain={terrain}
              terrainOpen={(isTerrainDisplayed(unitId))}
              compareCoreAttr={compareUnitAttribute}
              compareTerrainMovement={compareTerrainMovement}
              compareTerrainSpotting={compareTerrainSpotting}
              lookup={findUnitProperty}
              startCompare={startCompare}
              toggleTerrain={toggleTerrain}
              imageKey={imageKey}
            />
          ),
        )
      }
    </div>
  );
};

ItemList.propTypes = {
  unitsData: PropTypes.objectOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    chassis: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
  })).isRequired,
  unitsList: PropTypes.arrayOf(PropTypes.number).isRequired,
  terrain: PropTypes.objectOf(PropTypes.objectOf(PropTypes.shape({
    movement: PropTypes.objectOf(PropTypes.shape({
      points: PropTypes.number.isRequired,
      road_factor_dirt: PropTypes.number,
      road_factor_normal: PropTypes.number,
    })),
    spotting: PropTypes.objectOf(PropTypes.number),
  }))).isRequired,
  pagination: PropTypes.shape({
    currentPage: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
  }).isRequired,
  filters: PropTypes.objectOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    label: PropTypes.string,
  })).isRequired,
  startCompare: PropTypes.func.isRequired,
  imageKey: PropTypes.string.isRequired,
  isTerrainDisplayed: PropTypes.func.isRequired,
  compareUnitAttribute: PropTypes.func.isRequired,
  compareTerrainMovement: PropTypes.func.isRequired,
  compareTerrainSpotting: PropTypes.func.isRequired,
  findUnitProperty: PropTypes.func.isRequired,
  toggleTerrain: PropTypes.func.isRequired,
};

const mapStateToProps = (globalState, ownProps) => {
  const state = getLocalState(globalState, 'reducerItemList');

  return {
    isTerrainDisplayed: unitId => (state.terrainToggle.indexOf(unitId) >= 0),
    compareUnitAttribute: (property) => {
      const { compareId, unitsData } = ownProps;
      const baseValue = (compareId >= 0) ? unitsData[compareId][property] : 0;

      return { compareId, baseValue };
    },
    compareTerrainMovement: (terrain, climate) => {
      const { compareId, unitsData } = ownProps;

      // nothing to compare
      if (compareId < 0) {
        return { compareId, baseValue: 0 };
      }

      const terrainData = ownProps.terrain[terrain][climate].movement;
      const data = unitsData[compareId];
      const baseValue = (typeof terrainData !== 'undefined' && typeof terrainData[data.chassis] !== 'undefined')
        ? getTerrainPoints(
          data.movement,
          parseInt(terrainData[data.chassis].points, 10), 1,
        )
        : 0;

      return { compareId, baseValue };
    },
    compareTerrainSpotting: (terrain, climate) => {
      const { compareId, unitsData } = ownProps;

      // nothing to compare
      if (compareId < 0) {
        return { compareId, baseValue: 0 };
      }

      const terrainData = ownProps.terrain[terrain][climate].spotting;
      const data = unitsData[compareId];
      const baseValue = (typeof terrainData !== 'undefined' && typeof terrainData[data.category] !== 'undefined')
        ? getTerrainPoints(data.spotting, terrainData[data.category], 1)
        : 0;

      return { compareId, baseValue };
    },
    findUnitProperty: (id, property) => {
      const unitsData = ownProps.unitsData;
      if (typeof unitsData[id] === 'undefined') {
        return null;
      }

      const data = unitsData[id];
      if (typeof data[property] === 'undefined') {
        return null;
      }

      return data[property];
    },
  };
};

const mapDispatchToProps = dispatch => ({
  toggleTerrain: unitId => dispatch(listToggleTerrain(unitId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ItemList);
