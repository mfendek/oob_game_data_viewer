import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import GameMath from '../../utils/GameMath';
import ImagePath from '../../utils/ImagePath';
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
const TerrainLabel = ({ terrainName, data, terrain, compareMovement, compareSpotting }) => (
  <div className="unit-item__label-terrain">
    <div>{terrainName}</div>
    <div className="unit-item__label-terrain-item">
      <span>
        <img src={ImagePath.getImgUrl('terrain', 'movement')} alt="movement" />
      </span>
      <span>
        <img src={ImagePath.getImgUrl('terrain', 'spotting')} alt="spotting" />
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
            movement = GameMath.getTerrainPoints(
              data.movement,
              parseInt(movementData.points, 10),
              1,
            );

            if (typeof movementData.road_factor_dirt !== 'undefined') {
              extraMovementData = extraMovementData.concat(
                ', with dirt road ',
                GameMath.getTerrainPoints(
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
                GameMath.getTerrainPoints(
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
            spotting = GameMath.getTerrainPoints(data.spotting, spotting, 1);
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
  data: PropTypes.object.isRequired,
  terrain: PropTypes.object.isRequired,
  compareMovement: PropTypes.func.isRequired,
  compareSpotting: PropTypes.func.isRequired,
};

export default TerrainLabel;
