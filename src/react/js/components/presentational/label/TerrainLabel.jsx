import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { getTerrainPoints } from '../../../utils/GameMath';
import { getImgUrl } from '../../../utils/ImagePath';
import ComparisonText from '../icon/ComparisonText';

/**
 * Terrain label
 *
 * @param {string} terrainName
 * @param {Object} data
 * @param {Object} terrain
 * @param {function} compareMovement
 * @param {function} compareSpotting
 * @constructor
 */
const TerrainLabel = ({
  terrainName, data, terrain, compareMovement, compareSpotting,
}) => (
  <div className="unit-item__label-terrain">
    <div>{terrainName}</div>
    <div className="unit-item__label-terrain-item">
      <span>
        <img src={getImgUrl('terrain', 'movement')} alt="movement" />
      </span>
      <span>
        <img src={getImgUrl('terrain', 'spotting')} alt="spotting" />
      </span>
    </div>
    {
      Object.keys(terrain).map(
        (climate) => {
          const terrainData = terrain[climate];

          let movement = 0;
          let extraMovementData = '';
          if (typeof terrainData.movement !== 'undefined'
            && typeof terrainData.movement[data.chassis] !== 'undefined') {
            const movementData = terrainData.movement[data.chassis];
            movement = getTerrainPoints(
              data.movement,
              parseInt(movementData.points, 10),
              1,
            );

            if (typeof movementData.road_factor_dirt !== 'undefined') {
              extraMovementData = extraMovementData.concat(
                ', with dirt road ',
                getTerrainPoints(
                  data.movement,
                  parseInt(movementData.points, 10),
                  movementData.road_factor_dirt,
                ).toString(),
                ' tiles',
              );
            }

            if (typeof movementData.road_factor_normal !== 'undefined') {
              extraMovementData = extraMovementData.concat(
                ', with normal road ',
                getTerrainPoints(
                  data.movement,
                  parseInt(movementData.points, 10),
                  movementData.road_factor_normal,
                ).toString(),
                ' tiles',
              );
            }
          }

          let spotting = 0;
          if (typeof terrainData.spotting !== 'undefined'
            && typeof terrainData.spotting[data.category] !== 'undefined') {
            spotting = terrainData.spotting[data.category];
            spotting = getTerrainPoints(data.spotting, spotting, 1);
          }

          const title = terrainName.concat(
            ' (',
            climate,
            ') terrain, movement: ',
            movement.toString(),
            ' tiles',
            extraMovementData,
            ', spotting through ',
            spotting.toString(),
            ' tiles',
          );

          return (
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip">{title}</Tooltip>}
              key={terrainName.concat(climate)}
            >
              <div className={'unit-item__label-terrain-item unit-item__label-terrain-item--'.concat(climate)}>
                <ComparisonText
                  base={compareMovement(terrainName, climate)}
                  value={movement}
                  reversed={false}
                />
                <ComparisonText
                  base={compareSpotting(terrainName, climate)}
                  value={spotting}
                  reversed={false}
                />
              </div>
            </OverlayTrigger>
          );
        },
      )
    }
  </div>
);

TerrainLabel.propTypes = {
  terrainName: PropTypes.string.isRequired,
  data: PropTypes.shape({
    movement: PropTypes.number.isRequired,
    spotting: PropTypes.number.isRequired,
  }).isRequired,
  terrain: PropTypes.objectOf(PropTypes.objectOf(PropTypes.shape({
    movement: PropTypes.objectOf(PropTypes.shape({
      points: PropTypes.number.isRequired,
      road_factor_dirt: PropTypes.number,
      road_factor_normal: PropTypes.number,
    })),
    spotting: PropTypes.objectOf(PropTypes.number),
  }))).isRequired,
  compareMovement: PropTypes.func.isRequired,
  compareSpotting: PropTypes.func.isRequired,
};

export default TerrainLabel;
