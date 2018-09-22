/**
 * List manipulation (pagination, filtering)
 */

/**
 * @param {Array} list
 * @param {number} itemsPerPage
 * @returns {number}
 */
export const getNumberOfPages = (list, itemsPerPage) => (
  Math.ceil(list.length / itemsPerPage)
);

/**
 * Filter unit list based on filter setup
 *
 * @param {Object} unitsData
 * @param {Array} unitsList
 * @param {Object} filters
 * @returns {Array}
 */
export const getFilteredList = (unitsData, unitsList, filters) => {
  const filteredList = [];
  for (let i = 0; i < unitsList.length; i += 1) {
    const id = unitsList[i];
    const unitData = unitsData[id];

    // id filter
    if (typeof filters.id !== 'undefined' && filters.id.value !== '') {
      const idsInput = filters.id.value.toString().split(',');

      // reformat ids to proper type
      const ids = [];
      for (let idsIndex = 0; idsIndex < idsInput.length; idsIndex += 1) {
        ids.push(parseInt(idsInput[idsIndex], 10));
      }

      if (ids.indexOf(unitData.id) < 0) {
        continue;
      }
    }

    // name filter
    if (typeof filters.name !== 'undefined') {
      // remove unnecessary whitespace
      const nameFilter = filters.name.value.toString().trim();

      if (nameFilter !== '') {
        if (unitData.name_real.toLowerCase().indexOf(nameFilter.toLowerCase()) < 0) {
          continue;
        }
      }
    }

    // category filter
    if (typeof filters.category !== 'undefined' && filters.category.value !== '') {
      if (unitData.category !== filters.category.value) {
        continue;
      }
    }

    // type filter
    if (typeof filters.type !== 'undefined' && filters.type.value !== '') {
      if (unitData.type !== filters.type.value) {
        continue;
      }
    }

    // chassis filter
    if (typeof filters.chassis !== 'undefined' && filters.chassis.value !== '') {
      if (unitData.chassis !== filters.chassis.value) {
        continue;
      }
    }

    // trait filter
    if (typeof filters.trait !== 'undefined' && filters.trait.value !== '') {
      let itemFound = false;
      const itemsList = unitData.traits;

      for (let listIndex = 0; listIndex < itemsList.length; listIndex += 1) {
        const item = itemsList[listIndex];

        if (item.name === filters.trait.value) {
          itemFound = true;
          break;
        }
      }

      if (!itemFound) {
        continue;
      }
    }

    // switch filter
    if (typeof filters.switch !== 'undefined' && filters.switch.value !== '') {
      const itemsList = unitData.switch_type;

      // no switch type
      if (filters.switch.value === 'none' && itemsList.length > 0) {
        continue;
      }

      // specific switch type
      if (filters.switch.value !== 'none') {
        let itemFound = false;
        for (let listIndex = 0; listIndex < itemsList.length; listIndex += 1) {
          const item = itemsList[listIndex];

          if (item === filters.switch.value) {
            itemFound = true;
            break;
          }
        }

        if (!itemFound) {
          continue;
        }
      }
    }

    // faction filter
    if (typeof filters.faction !== 'undefined' && filters.faction.value !== '') {
      if (unitData.factions.indexOf(filters.faction.value) < 0) {
        continue;
      }
    }

    // available filter
    if (typeof filters.available !== 'undefined' && filters.available.value !== '') {
      const available = new Date(filters.available.value).getTime();

      if (
        (unitData.available !== '' && (parseInt(unitData.available, 10) * 1000) > available)
        || (unitData.expire !== '' && (parseInt(unitData.expire, 10) * 1000) < available)
      ) {
        continue;
      }
    }

    filteredList.push(id);
  }

  return filteredList;
};

export default { getNumberOfPages, getFilteredList };
