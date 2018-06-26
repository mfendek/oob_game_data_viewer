/**
 * Image paths
 */

/**
 * get path to image file
 *
 * @param {string} name
 * @param {string} value
 * @returns {string}
 */
export const getImgUrl = (name, value) => {
  if (name === 'faction') {
    return 'src/game_data/Graphics/flags/capPointFlag_'.concat((value === 'all') ? 'unclaimed' : value, '.png');
  }

  if (name === 'category') {
    return 'src/game_data/Graphics/UI/resource_'.concat(value, 'supply.png');
  }

  if (name === 'type') {
    return 'src/game_data/Graphics/UI/ClassIcons/'.concat(value, '.png');
  }

  if (name === 'carrier') {
    return 'src/game_data/Graphics/UI/ClassIcons/Small/'.concat(value, '.png');
  }

  if (name === 'chassis') {
    return 'src/img/chassis/'.concat(value, '.png');
  }

  if (name === 'cost') {
    return 'src/game_data/Graphics/UI/resource_funds.png';
  }

  if (name === 'old_stats') {
    return 'src/game_data/Graphics/UI/Stats/stat_'.concat(value, '.png');
  }

  if (name === 'new_stats') {
    return 'src/img/stats/'.concat(value, '.png');
  }

  if (name === 'specialisation') {
    return 'src/game_data/Graphics/UI/Specialisations/'.concat(value, '.png');
  }

  if (name === 'switch_action') {
    return 'src/game_data/Graphics/UI/Large/'.concat('button_', value, '_high_1280.png');
  }

  if (name === 'weapon_ability') {
    return 'src/game_data/Graphics/UI/Large/'.concat('ability_weapon_', value, '.png');
  }

  if (name === 'unit_image') {
    if (value === 'placeholder') {
      return 'src/img/spinner.gif';
    }

    if (value === 'no_image') {
      return 'src/img/no_image.png';
    }

    return 'src/img/units/'.concat(value.toLowerCase(), '.png');
  }

  if (name === 'terrain') {
    return 'src/img/'.concat(value, '.png');
  }

  return '';
};

/**
 * get background image property
 *
 * @param {string} name
 * @param {string} value
 * @returns {Object}
 */
export const getBackgroundImg = (name, value) => (
  { backgroundImage: 'url("'.concat(getImgUrl(name, value), '")') }
);

export default { getImgUrl, getBackgroundImg };
