import { Component } from 'react';

/**
 * Game math functions
 */
class GameMath extends Component {
  /**
   * calculate terrain points
   *
   * @param {number} points
   * @param {number} cost
   * @param {number|float} factor
   * @returns {number}
   */
  static getTerrainPoints(points, cost, factor) {
    if (cost === 0) {
      return 0;
    }

    return Math.floor(points / (cost * factor));
  }
}

export default GameMath;
