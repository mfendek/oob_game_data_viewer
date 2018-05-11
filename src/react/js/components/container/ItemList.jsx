import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GameMath from '../utils/GameMath';
import ListManipulation from '../utils/ListManipulation';
import ItemDetail from '../presentational/ItemDetail';

/**
 * Item list (filtering and pagination)
 *
 * @param {Object} unitsData
 * @param {array} unitsList
 * @param {Object} terrain
 * @param {Object} pagination
 * @param {Object} filters
 * @param {number} compareId
 * @param {function} startCompare
 * @param {string} appVersion
 * @constructor
 */
class ItemList extends Component {
  /**
   * @param props
   * @constructor
   */
  constructor(props) {
    super(props);

    this.state = {
      terrainToggle: [],
    };

    this.getPaginatedList = this.getPaginatedList.bind(this);
    this.compareUnitAttribute = this.compareUnitAttribute.bind(this);
    this.compareTerrainMovement = this.compareTerrainMovement.bind(this);
    this.compareTerrainSpotting = this.compareTerrainSpotting.bind(this);
    this.findUnitProperty = this.findUnitProperty.bind(this);
    this.toggleTerrain = this.toggleTerrain.bind(this);
  }

  /**
   * @param {Array} list
   * @returns {Array}
   */
  getPaginatedList(list) {
    const { currentPage, itemsPerPage } = this.props.pagination;
    const pageStart = (currentPage - 1) * itemsPerPage;
    const pageEnd = currentPage * itemsPerPage;

    return list.slice(pageStart, pageEnd);
  }

  /**
   * fetch data of a compared unit
   *
   * @param {string} property
   * @returns {Object}
   */
  compareUnitAttribute(property) {
    const { compareId, unitsData } = this.props;
    const baseValue = (compareId >= 0) ? unitsData[compareId][property] : 0;

    return { compareId, baseValue };
  }

  /**
   * compare movement with another unit
   *
   * @param {string} terrain
   * @param {string} climate
   * @returns {Object}
   */
  compareTerrainMovement(terrain, climate) {
    const { compareId, unitsData } = this.props;

    // nothing to compare
    if (compareId < 0) {
      return { compareId, baseValue: 0 };
    }

    const terrainData = this.props.terrain[terrain][climate].movement;
    const data = unitsData[compareId];
    const baseValue = (typeof terrainData !== 'undefined' && typeof terrainData[data.chassis] !== 'undefined')
      ? GameMath.getTerrainPoints(data.movement, parseInt(terrainData[data.chassis].points, 10), 1)
      : 0;

    return { compareId, baseValue };
  }

  /**
   * compare spotting with another unit
   *
   * @param {string} terrain
   * @param {string} climate
   * @returns {Object}
   */
  compareTerrainSpotting(terrain, climate) {
    const { compareId, unitsData } = this.props;

    // nothing to compare
    if (compareId < 0) {
      return { compareId, baseValue: 0 };
    }

    const terrainData = this.props.terrain[terrain][climate].spotting;
    const data = unitsData[compareId];
    const baseValue = (typeof terrainData !== 'undefined' && typeof terrainData[data.category] !== 'undefined')
      ? GameMath.getTerrainPoints(data.spotting, terrainData[data.category], 1)
      : 0;

    return { compareId, baseValue };
  }

  /**
   * lookup property of specified unit
   *
   * @param {number} id
   * @param {string} property
   * @returns {*}
   */
  findUnitProperty(id, property) {
    const unitsData = this.props.unitsData;
    if (typeof unitsData[id] === 'undefined') {
      return null;
    }

    const data = unitsData[id];
    if (typeof data[property] === 'undefined') {
      return null;
    }

    return data[property];
  }

  /**
   * toggle terrain view state on a specific unit
   *
   * @param {number} unitId
   */
  toggleTerrain(unitId) {
    const terrainToggle = this.state.terrainToggle;
    const position = terrainToggle.indexOf(unitId);

    if (position >= 0) {
      // terrain view is open - close it
      terrainToggle.splice(position, 1);
    } else {
      // terrain view is closed - open it
      terrainToggle.push(unitId);
    }

    this.setState({ terrainToggle });
  }

  render() {
    return (
      <div className="units-list">
        {
          this.getPaginatedList(
            ListManipulation.getFilteredList(
              this.props.unitsData,
              this.props.unitsList,
              this.props.filters,
            ),
          ).map(
            unitId => (
              <ItemDetail
                key={unitId}
                data={this.props.unitsData[unitId]}
                terrain={this.props.terrain}
                terrainOpen={(this.state.terrainToggle.indexOf(unitId) >= 0)}
                compareCoreAttr={this.compareUnitAttribute}
                compareTerrainMovement={this.compareTerrainMovement}
                compareTerrainSpotting={this.compareTerrainSpotting}
                lookup={this.findUnitProperty}
                startCompare={this.props.startCompare}
                toggleTerrain={this.toggleTerrain}
                appVersion={this.props.appVersion}
              />
            ),
          )
        }
      </div>
    );
  }
}

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
  compareId: PropTypes.number.isRequired,
  startCompare: PropTypes.func.isRequired,
  appVersion: PropTypes.string.isRequired,
};

export default ItemList;
