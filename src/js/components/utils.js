import $ from 'jquery';

export default function () {
  $(document).ready(function () {
    let manager = {
      // contains all units data indexed by id
      unitsData: {},

      // list of unit ids ordered by name
      unitsOrder: [],

      // list of unit ids ordered by name with current filter applied
      unitsFiltered: [],

      // tarrain data
      terrain: {},

      // number of items shown per page
      itemsPerPage: 0,

      // total number of pages
      pagesTotal: 0,

      // current page (starts at 1)
      currentPage: 1,

      // initial page suggested by backend
      suggestedPage: 0,

      // current filters
      filters: {},

      // currently compared unit id
      compareId: -1,

      // list of units that have the terrain data expanded
      expandedTerrain: [],

      // application version
      app_version: '',

      /**
       * calculate first item of current page
       *
       * @returns {number}
       */
      getPageStart: function () {
        const manager = this;

        return (manager.currentPage - 1) * manager.itemsPerPage;
      },

      /**
       * calculate last item of current page
       *
       * @returns {number}
       */
      getPageEnd: function () {
        const manager = this;

        return (manager.currentPage * manager.itemsPerPage) - 1;
      },

      /**
       * get path to image file
       *
       * @param {string} name
       * @param {string} value
       * @returns {string}
       */
      getImgUrl: function (name, value) {
        if (name === 'faction') {
          value = (value === 'all') ? 'unclaimed' : value;
          return 'src/game_data/Graphics/flags/capPointFlag_'.concat(value, '.png');
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

        return '';
      },

      /**
       * get background image property
       *
       * @param {string} name
       * @param {string} value
       * @returns {string}
       */
      getBackgroundImg: function (name, value) {
        const manager = this;

        return 'background-image: url("'.concat(manager.getImgUrl(name, value), '")');
      },

      /**
       * laod initial data
       *
       * @param {Object} data
       * @param {function} callback
       */
      loadInitData: function (data, callback) {
        const manager = this;

        // initial data load
        const order = $('#units-data-ordered');
        const terrain = $('#terrain-data-file');
        const pagesTotal = $('#pages-total');
        const preselectedFilters = $('#preselected-filters');
        const preselectedCompare = $('#preselected-compare');

        // pagination data
        manager.pagesTotal = parseInt(pagesTotal.text());
        manager.itemsPerPage = parseInt(pagesTotal.data('items-per-age'));
        manager.suggestedPage = parseInt($('#current-page').text());

        // parse data
        manager.unitsData = data;
        const units = manager.unitsData;

        manager.terrain = JSON.parse(terrain.text());
        manager.unitsOrder = JSON.parse(order.text());
        manager.unitsFiltered = manager.unitsOrder;

        // pre selected unit compare
        if (preselectedCompare.length > 0) {
          manager.startCompare(parseInt(preselectedCompare.text()));
        }

        if (preselectedFilters.length > 0) {
          // preselected filters are present
          const filters = JSON.parse(preselectedFilters.text());

          for (let filter in filters) {
            const filterValue = filters[filter];

            // update filter selection
            if (filter === 'id') {
              $('input[name="filter-unit-id"]').val(filterValue);
            } else if (filter === 'name') {
              $('input[name="filter-unit-name"]').val(filterValue);
            } else if (filter === 'category') {
              $('select[name="filter-category"]').val(filterValue);
            } else if (filter === 'type') {
              $('select[name="filter-type"]').val(filterValue);
            } else if (filter === 'chassis') {
              $('select[name="filter-chassis"]').val(filterValue);
            } else if (filter === 'faction') {
              $('select[name="filter-faction"]').val(filterValue);
            } else if (filter === 'available') {
              $('input[name="filter-available"]').val(filterValue);
            } else {
              // no filter was matched
              continue;
            }

            manager.addFilter(filter, filterValue);
          }

          manager.applyFilters();

        } else {
          // default page load
          manager.loadPage();
          manager.refreshPagination();
        }

        // cleanup used data sources
        order.remove();
        terrain.remove();
        preselectedFilters.remove();

        callback();
      },

      /**
       * initialize all data
       *
       * @param {function} callback
       */
      initData: function (callback) {
        const manager = this;

        // store app version (used in caching)
        manager.app_version = $('.version-info').data('version');
        const unitDataKey = 'unit-data';

        const unitData = manager.getCachedItem(unitDataKey);
        if (unitData === null) {
          // unit data is not cached - fetch fresh data
          $.post('', {'units-data': 1}, function (data) {
            manager.loadInitData(data, callback);

            // store unit data for future use
            manager.setCachedItem(unitDataKey, JSON.stringify(data));
          });
        } else {
          // unit data is cached - use it
          manager.loadInitData(JSON.parse(unitData), callback);
        }
      },

      /**
       * @param {string} key
       * @returns {string}
       */
      getCacheKey: function (key) {
        const manager = this;
        return manager.app_version.concat('_', key);
      },

      /**
       * @param {string} key
       * @returns {string}
       */
      getCachedItem: function (key) {
        // storage not available
        if (typeof(Storage) === 'undefined') {
          return null;
        }

        const manager = this;
        const cacheKey = manager.getCacheKey(key);

        const item = localStorage.getItem(cacheKey);
        if (typeof(item) === 'undefined') {
          return null;
        }

        return item;
      },

      /**
       * @param {string} key
       * @param {string} data
       */
      setCachedItem: function (key, data) {
        // storage not available
        if (typeof(Storage) === 'undefined') {
          return;
        }

        const manager = this;
        const cacheKey = manager.getCacheKey(key);
        localStorage.setItem(cacheKey, data);
      },

      /**
       * format timestamp (in seconds) to date format
       *
       * @param {number} timestamp
       * @returns {string}
       */
      formatDate: function (timestamp) {
        const date = new Date(timestamp * 1000);

        return date.toLocaleDateString();
      },

      /**
       * generate url with provided params
       *
       * @param {Object} data
       * @returns {string}
       */
      getUrlWithParams: function (data) {
        let params = {};

        // filters
        if (typeof data['f'] !== 'undefined') {
          params['f'] = JSON.stringify(data['f']);
        }

        // pagination
        if (typeof data['p'] !== 'undefined') {
          params['p'] = data['p'];
        }

        // unit comparison
        if (typeof data['c'] !== 'undefined') {
          params['c'] = data['c'];
        }

        if (Object.keys(params).length === 0) {
          return '';
        }

        return '?'.concat($.param(params));
      },

      /**
       * load current page
       */
      loadPage: function () {
        const manager = this;
        const units = manager.unitsData;
        const unitIds = manager.unitsFiltered;
        const unitsList = $('#units-list');

        for (let i = manager.getPageStart(); i <= manager.getPageEnd(); i++) {
          if (typeof unitIds[i] === 'undefined') {
            break;
          }

          const id = unitIds[i];

          unitsList.append(manager.loadUnit(units[id]));
        }

        $('#current-page').text(manager.currentPage);
        $('#current-page-bottom').text(manager.currentPage);
      },

      /**
       * compare core attribute with another unit
       *
       * @param {Object} element
       * @param {string} property
       * @param {number} value
       * @param reversed
       */
      compareCoreAttribute: function (element, property, value, reversed) {
        const manager = this;

        if (typeof reversed === 'undefined') {
          reversed = false;
        }

        // nothing to compare
        if (manager.compareId < 0) {
          return;
        }

        // determine if change needs to be highlighted
        const baseValue = manager.unitsData[manager.compareId][property];
        let subElement;
        if (baseValue > value) {
          element.addClass((reversed) ? 'positive-change' : 'negative-change');

          // wrap text inside an element
          subElement = $('<span></span>');
          subElement.text(element.text());
          element.text('');
          element.append(subElement);

          const diff = baseValue - value;
          subElement = $('<span></span>');
          subElement.text(' -'.concat(diff.toString()));
          element.append(subElement);
        } else if (baseValue < value) {
          element.addClass((reversed) ? 'negative-change' : 'positive-change');

          // wrap text inside an element
          subElement = $('<span></span>');
          subElement.text(element.text());
          element.text('');
          element.append(subElement);

          const diff = value - baseValue;
          subElement = $('<span></span>');
          subElement.text(' +'.concat(diff.toString()));
          element.append(subElement);
        }
      },

      /**
       * compare movement with another unit
       *
       * @param {Object} element
       * @param {string} climate
       * @param {string} terrain
       * @param {number} value
       */
      compareTerrainMovement: function (element, climate, terrain, value) {
        const manager = this;

        // nothing to compare
        if (manager.compareId < 0) {
          return;
        }

        const terrainData = manager.terrain[climate][terrain]['movement'];
        const data = manager.unitsData[manager.compareId];

        let points;
        if (typeof terrainData[data['chassis']] !== 'undefined') {
          points = manager.getTerrainPoints(data['movement'], terrainData[data['chassis']]['points']);
        } else {
          points = 0;
        }

        // determine if change needs to be highlighted
        let subElement;
        if (points > value) {
          element.addClass('negative-change');

          const diff = points - value;
          subElement = $('<span></span>');
          subElement.text(' -'.concat(diff.toString()));
          element.append(subElement);
        } else if (points < value) {
          element.addClass('positive-change');

          const diff = value - points;
          subElement = $('<span></span>');
          subElement.text(' +'.concat(diff.toString()));
          element.append(subElement);
        }
      },

      /**
       * compare spotting with another unit
       *
       * @param {Object} element
       * @param {string} climate
       * @param {string} terrain
       * @param {number} value
       */
      compareTerrainSpotting: function (element, climate, terrain, value) {
        const manager = this;

        // nothing to compare
        if (manager.compareId < 0) {
          return;
        }

        const terrainData = manager.terrain[climate][terrain]['spotting'];
        const data = manager.unitsData[manager.compareId];

        let points;
        if (typeof terrainData[data['category']] !== 'undefined') {
          points = manager.getTerrainPoints(data['spotting'], terrainData[data['category']]);
        } else {
          points = 0;
        }

        // determine if change needs to be highlighted
        let subElement;
        if (points > value) {
          element.addClass('negative-change');

          const diff = points - value;
          subElement = $('<span></span>');
          subElement.text(' -'.concat(diff.toString()));
          element.append(subElement);
        } else if (points < value) {
          element.addClass('positive-change');

          const diff = value - points;
          subElement = $('<span></span>');
          subElement.text(' +'.concat(diff.toString()));
          element.append(subElement);
        }
      },

      /**
       * calculate terrain points
       *
       * @param {number} points
       * @param {number} cost
       * @param {float} factor
       * @returns {number}
       */
      getTerrainPoints: function (points, cost, factor) {
        if (typeof factor === 'undefined') {
          factor = 1;
        }

        return Math.floor(points / (cost * factor));
      },

      /**
       * load unit from data
       *
       * @param {Object} data
       * @returns {HTMLElement}
       */
      loadUnit: function (data) {
        const manager = this;
        const id = data['id'];
        const unitElement = $('<div></div>');
        unitElement.addClass('unit-item');

        // new content row
        let contentRow = $('<div></div>');
        contentRow.addClass('unit-item__content-row');

        // title
        let element = $('<div></div>');
        element.addClass('unit-item__detail-title');
        let subElement = $('<a></a>');
        subElement.attr('href', manager.getUrlWithParams({f:{id : id}}));
        subElement.text(data['name_real'].concat(' (', id, ')'));
        element.append(subElement);
        contentRow.append(element);

        // category
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--square-small');
        element.attr('style', manager.getBackgroundImg('category', data['category']));
        element.attr('title', data['category'].concat(' unit category'));
        contentRow.append(element);

        // type
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--square-small');
        element.attr('style', manager.getBackgroundImg('type', data['type']));
        element.attr('title', data['type'].concat(' unit type'));
        contentRow.append(element);

        // chassis
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--square-small');
        element.attr('style', manager.getBackgroundImg('chassis', data['chassis']));
        element.attr('title', 'unit has '.concat(data['chassis'], ' movement type'));
        contentRow.append(element);

        // cost
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--square-small');
        element.addClass('unit-item__content-icon--text-center');
        element.attr('style', manager.getBackgroundImg('cost', data['cost']));
        element.attr('title', 'unit costs '.concat(data['cost'].toString(), ' resource points'));
        subElement = $('<span></span>');
        subElement.text(data['cost']);
        subElement.addClass('change-break-line');
        manager.compareCoreAttribute(subElement, 'cost', data['cost'], true);
        element.append(subElement);
        contentRow.append(element);

        // supply
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--square-small');
        element.addClass('unit-item__content-icon--text-center');
        element.attr('style', manager.getBackgroundImg('category', data['category']));
        element.attr('title', 'unit uses '.concat(data['supply'].toString(),' ', data['category'], ' supply'));
        subElement = $('<span></span>');
        subElement.text(data['supply']);
        manager.compareCoreAttribute(subElement, 'supply', data['supply'], true);
        element.append(subElement);
        contentRow.append(element);

        // carrier
        if (data['carrier'].length > 0) {
          const itemsList = data['carrier'];

          for (let listIndex = 0; listIndex < itemsList.length; listIndex++) {
            const item = itemsList[listIndex];
            element = $('<div></div>');
            element.addClass('unit-item__content-icon');
            element.addClass('unit-item__content-icon--square-small');
            element.attr('style', manager.getBackgroundImg('carrier', item));
            element.attr('title', 'unit can land on '.concat(item));
            contentRow.append(element);
          }
        }

        // specialisation
        if (data['specialisation'] !== '') {
          element = $('<div></div>');
          element.addClass('unit-item__content-icon');
          element.addClass('unit-item__content-icon--square-small');
          element.attr('style', manager.getBackgroundImg('specialisation', data['specialisation']));
          element.attr('title', 'unit requires '.concat(data['specialisation'], ' specialisation'));
          contentRow.append(element);
        }

        // end content row
        unitElement.append(contentRow);

        // new content row
        contentRow = $('<div></div>');
        contentRow.addClass('unit-item__content-row');

        // available
        element = $('<div></div>');
        element.addClass('unit-item__label-green');
        element.text((data['available'] !== '') ? manager.formatDate(data['available']) : 'always');
        element.attr('title', 'available on');
        contentRow.append(element);

        // expire
        element = $('<div></div>');
        element.addClass('unit-item__label-red');
        element.text((data['expire'] !== '') ? manager.formatDate(data['expire']) : 'never');
        element.attr('title', 'expires on');
        contentRow.append(element);

        // attack type
        element = $('<div></div>');
        element.addClass('unit-item__label-red');
        element.text(data['attack_type']);
        element.attr('title', 'attack type');
        contentRow.append(element);

        // defense type
        element = $('<div></div>');
        element.addClass('unit-item__label-green');
        element.text(data['defense_type']);
        element.attr('title', 'defense type');
        contentRow.append(element);

        // end content row
        unitElement.append(contentRow);

        // new content row
        contentRow = $('<div></div>');
        contentRow.addClass('unit-item__content-row');

        // movement
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--rectangle-large');
        element.addClass('unit-item__content-icon--text-stat');
        element.attr('style', manager.getBackgroundImg('old_stats', 'mp'));
        element.attr('title', 'unit has '.concat(data['movement'].toString(), ' movement points'));
        subElement = $('<span></span>');
        subElement.text(data['movement']);
        manager.compareCoreAttribute(subElement, 'movement', data['movement']);
        element.append(subElement);
        contentRow.append(element);

        // spotting
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--rectangle-large');
        element.addClass('unit-item__content-icon--text-stat');
        element.attr('style', manager.getBackgroundImg('new_stats', 'spotting'));
        element.attr(
            'title',
            'unit has '.concat(data['spotting'].toString(), ' spotting points (adjacent tiles are always visible)')
        );
        subElement = $('<span></span>');
        subElement.text(data['spotting']);
        manager.compareCoreAttribute(subElement, 'spotting', data['spotting']);
        element.append(subElement);
        contentRow.append(element);

        // actions
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--rectangle-large');
        element.addClass('unit-item__content-icon--text-stat');
        element.attr('style', manager.getBackgroundImg('new_stats', 'actions'));
        element.attr('title', 'unit has '.concat(data['actions'].toString(), ' actions'));
        subElement = $('<span></span>');
        subElement.text(data['actions']);
        manager.compareCoreAttribute(subElement, 'actions', data['actions']);
        element.append(subElement);
        contentRow.append(element);

        // steps
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--rectangle-large');
        element.addClass('unit-item__content-icon--text-stat');
        element.attr('style', manager.getBackgroundImg('new_stats', 'steps'));
        element.attr('title','unit has '.concat(data['steps'].toString(), ' steps'));
        subElement = $('<span></span>');
        subElement.text(data['steps']);
        manager.compareCoreAttribute(subElement, 'steps', data['steps']);
        element.append(subElement);
        contentRow.append(element);

        // range
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--rectangle-large');
        element.addClass('unit-item__content-icon--text-stat');
        element.attr('style', manager.getBackgroundImg('old_stats', 'range'));

        let description = '';
        if (data['range'] > 0) {
          description = 'unit can attack other units within '.concat(data['range'].toString(), ' tiles')
        } else {
          description = 'unit can attack only adjacent units';
        }

        element.attr('title', description);
        subElement = $('<span></span>');
        subElement.text(data['range']);
        manager.compareCoreAttribute(subElement, 'range', data['range']);
        element.append(subElement);
        contentRow.append(element);

        // shock
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--rectangle-large');
        element.addClass('unit-item__content-icon--text-stat');
        element.attr('style', manager.getBackgroundImg('old_stats', 'shock'));
        element.attr('title', 'shock damages enemy efficiency');
        subElement = $('<span></span>');
        subElement.text(data['shock']);
        manager.compareCoreAttribute(subElement, 'shock', data['shock']);
        element.append(subElement);
        contentRow.append(element);

        // assault
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--rectangle-large');
        element.addClass('unit-item__content-icon--text-stat');
        element.attr('style', manager.getBackgroundImg('old_stats', 'assault'));
        element.attr('title', 'assault damages enemy entrenchment');
        subElement = $('<span></span>');
        subElement.text(data['assault']);
        manager.compareCoreAttribute(subElement, 'assault', data['assault']);
        element.append(subElement);
        contentRow.append(element);

        // fuel
        if (data['fuel'] > 0) {
          element = $('<div></div>');
          element.addClass('unit-item__content-icon');
          element.addClass('unit-item__content-icon--rectangle-large');
          element.addClass('unit-item__content-icon--text-stat');
          element.attr('style', manager.getBackgroundImg('new_stats', 'fuel'));

          let description = '';
          if (data['category'] === 'air') {
            description = 'unit can stay airborne for '.concat(data['fuel'].toString(), ' turns');
          } else if (data['category'] === 'land') {
            description = 'unit is supply immune for '.concat(data['fuel'].toString(), ' turns');
          } else if (data['category'] === 'naval') {
            description = 'unit can stay submerged for '.concat(data['fuel'].toString(), ' turns');
          }

          element.attr('title', description);
          subElement = $('<span></span>');
          subElement.text(data['fuel']);
          manager.compareCoreAttribute(subElement, 'fuel', data['fuel']);
          element.append(subElement);
          contentRow.append(element);
        }

        // radar
        if (data['radar'] > 0) {
          element = $('<div></div>');
          element.addClass('unit-item__content-icon');
          element.addClass('unit-item__content-icon--rectangle-large');
          element.addClass('unit-item__content-icon--text-stat');
          element.attr('style', manager.getBackgroundImg('new_stats', 'radar'));
          element.attr('title', 'unit can spot radar targets within '.concat(data['radar'].toString(), ' tiles'));
          subElement = $('<span></span>');
          subElement.text(data['radar']);
          manager.compareCoreAttribute(subElement, 'radar', data['radar']);
          element.append(subElement);
          contentRow.append(element);
        }

        // cargo
        if (data['cargo'] > 0) {
          element = $('<div></div>');
          element.addClass('unit-item__content-icon');
          element.addClass('unit-item__content-icon--rectangle-large');
          element.addClass('unit-item__content-icon--text-stat');
          element.attr('style', manager.getBackgroundImg('new_stats', 'cargo'));
          element.attr('title', 'unit can carry '.concat(data['cargo'].toString(), ' other units inside'));
          subElement = $('<span></span>');
          subElement.text(data['cargo']);
          manager.compareCoreAttribute(subElement, 'cargo', data['cargo']);
          element.append(subElement);
          contentRow.append(element);
        }

        // torpedo attack
        if (data['torpedo_attack'] > 0) {
          element = $('<div></div>');
          element.addClass('unit-item__content-icon');
          element.addClass('unit-item__content-icon--rectangle-large');
          element.addClass('unit-item__content-icon--text-stat');
          element.attr('style', manager.getBackgroundImg('new_stats', 'torpedo_attack'));
          element.attr('title', 'unit has '.concat(data['torpedo_attack'].toString(), ' torpedo attack'));
          subElement = $('<span></span>');
          subElement.text(data['torpedo_attack']);
          manager.compareCoreAttribute(subElement, 'torpedo_attack', data['torpedo_attack']);
          element.append(subElement);
          contentRow.append(element);
        }

        // torpedo range
        if (data['torpedo_range'] > 0) {
          element = $('<div></div>');
          element.addClass('unit-item__content-icon');
          element.addClass('unit-item__content-icon--rectangle-large');
          element.addClass('unit-item__content-icon--text-stat');
          element.attr('style', manager.getBackgroundImg('new_stats', 'torpedo_range'));
          element.attr('title', 'unit can attack other units with torpedo within '.concat(data['torpedo_range'].toString(), ' tiles'));
          subElement = $('<span></span>');
          subElement.text(data['torpedo_range']);
          manager.compareCoreAttribute(subElement, 'torpedo_range', data['torpedo_range']);
          element.append(subElement);
          contentRow.append(element);
        }

        // torpedo cool-down
        if (data['torpedo_cool_down'] > 0) {
          element = $('<div></div>');
          element.addClass('unit-item__content-icon');
          element.addClass('unit-item__content-icon--rectangle-large');
          element.addClass('unit-item__content-icon--text-stat');
          element.attr('style', manager.getBackgroundImg('new_stats', 'torpedo_cool_down'));
          element.attr('title', 'it takes this unit '.concat(data['torpedo_cool_down'].toString(), ' turns to reload the torpedo'));
          subElement = $('<span></span>');
          subElement.text(data['torpedo_cool_down']);
          manager.compareCoreAttribute(subElement, 'torpedo_cool_down', data['torpedo_cool_down']);
          element.append(subElement);
          contentRow.append(element);
        }

        // bombardment
        if (data['bombardment'] > 0) {
          element = $('<div></div>');
          element.addClass('unit-item__content-icon');
          element.addClass('unit-item__content-icon--rectangle-large');
          element.addClass('unit-item__content-icon--text-stat');
          element.attr('style', manager.getBackgroundImg('new_stats', 'bombardment'));
          element.attr('title', 'bombardment damages infrastructure');
          subElement = $('<span></span>');
          subElement.text(data['bombardment']);
          manager.compareCoreAttribute(subElement, 'bombardment', data['bombardment']);
          element.append(subElement);
          contentRow.append(element);
        }

        // blast
        if (data['blast'] > 0) {
          element = $('<div></div>');
          element.addClass('unit-item__content-icon');
          element.addClass('unit-item__content-icon--rectangle-large');
          element.addClass('unit-item__content-icon--text-stat');
          element.attr('style', manager.getBackgroundImg('new_stats', 'blast'));
          element.attr('title', 'unit also attacks all units within '.concat(data['blast'].toString(), ' tiles radius from the target tile'));
          subElement = $('<span></span>');
          subElement.text(data['blast']);
          manager.compareCoreAttribute(subElement, 'blast', data['blast']);
          element.append(subElement);
          contentRow.append(element);
        }

        // end content row
        unitElement.append(contentRow);

        // new content row
        contentRow = $('<div></div>');
        contentRow.addClass('unit-item__content-row');

        // vehicle attack
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--rectangle-large');
        element.addClass('unit-item__content-icon--text-stat');
        element.attr('style', manager.getBackgroundImg('old_stats', 'vehicle_attack'));
        element.attr('title', 'vehicle attack');
        subElement = $('<span></span>');
        subElement.text(data['vehicle_attack']);
        manager.compareCoreAttribute(subElement, 'vehicle_attack', data['vehicle_attack']);
        element.append(subElement);
        contentRow.append(element);

        // vehicle close attack
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--rectangle-large');
        element.addClass('unit-item__content-icon--text-stat');
        element.attr('style', manager.getBackgroundImg('new_stats', 'vehicle_close_attack'));
        element.attr('title','vehicle close attack (the higher the cover of the battlefield'
            .concat(' the closer is the attack value to the close attack value)'));
        subElement = $('<span></span>');
        subElement.text(data['vehicle_close_attack']);
        manager.compareCoreAttribute(subElement, 'vehicle_close_attack', data['vehicle_close_attack']);
        element.append(subElement);
        contentRow.append(element);

        // infantry attack
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--rectangle-large');
        element.addClass('unit-item__content-icon--text-stat');
        element.attr('style', manager.getBackgroundImg('old_stats', 'infantry_attack'));
        element.attr('title', 'infantry attack');
        subElement = $('<span></span>');
        subElement.text(data['infantry_attack']);
        manager.compareCoreAttribute(subElement, 'infantry_attack', data['infantry_attack']);
        element.append(subElement);
        contentRow.append(element);

        // infantry close attack
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--rectangle-large');
        element.addClass('unit-item__content-icon--text-stat');
        element.attr('style', manager.getBackgroundImg('new_stats', 'infantry_close_attack'));
        element.attr('title','infantry close attack (the higher the cover of the battlefield'
            .concat(' the closer is the attack value to the close attack value)'));
        subElement = $('<span></span>');
        subElement.text(data['infantry_close_attack']);
        manager.compareCoreAttribute(subElement, 'infantry_close_attack', data['infantry_close_attack']);
        element.append(subElement);
        contentRow.append(element);

        // air attack small
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--rectangle-large');
        element.addClass('unit-item__content-icon--text-stat');
        element.attr('style', manager.getBackgroundImg('old_stats', 'air_small_attack'));
        element.attr('title', 'air attack against small targets');
        subElement = $('<span></span>');
        subElement.text(data['air_attack_small']);
        manager.compareCoreAttribute(subElement, 'air_attack_small', data['air_attack_small']);
        element.append(subElement);
        contentRow.append(element);

        // air attack large
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--rectangle-large');
        element.addClass('unit-item__content-icon--text-stat');
        element.attr('style', manager.getBackgroundImg('old_stats', 'air_large_attack'));
        element.attr('title', 'air attack against large targets');
        subElement = $('<span></span>');
        subElement.text(data['air_attack_large']);
        manager.compareCoreAttribute(subElement, 'air_attack_large', data['air_attack_large']);
        element.append(subElement);
        contentRow.append(element);

        // naval attack small
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--rectangle-large');
        element.addClass('unit-item__content-icon--text-stat');
        element.attr('style', manager.getBackgroundImg('old_stats', 'naval_small_attack'));
        element.attr('title', 'naval attack against small targets');
        subElement = $('<span></span>');
        subElement.text(data['naval_attack_small']);
        manager.compareCoreAttribute(subElement, 'naval_attack_small', data['naval_attack_small']);
        element.append(subElement);
        contentRow.append(element);

        // naval attack small - primary guns
        if (data['naval_attack_small_pg'] > 0) {
          element = $('<div></div>');
          element.addClass('unit-item__content-icon');
          element.addClass('unit-item__content-icon--rectangle-large');
          element.addClass('unit-item__content-icon--text-stat');
          element.attr('style', manager.getBackgroundImg('new_stats', 'naval_attack_small_pg'));
          element.attr('title', 'naval attack against small targets using primary guns');
          subElement = $('<span></span>');
          subElement.text(data['naval_attack_small_pg']);
          manager.compareCoreAttribute(subElement, 'naval_attack_small_pg', data['naval_attack_small_pg']);
          element.append(subElement);
          contentRow.append(element);
        }

        // naval attack large
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--rectangle-large');
        element.addClass('unit-item__content-icon--text-stat');
        element.attr('style', manager.getBackgroundImg('old_stats', 'naval_large_attack'));
        element.attr('title', 'naval attack against large targets');
        subElement = $('<span></span>');
        subElement.text(data['naval_attack_large']);
        manager.compareCoreAttribute(subElement, 'naval_attack_large', data['naval_attack_large']);
        element.append(subElement);
        contentRow.append(element);

        // naval attack large - primary guns
        if (data['naval_attack_large_pg'] > 0) {
          element = $('<div></div>');
          element.addClass('unit-item__content-icon');
          element.addClass('unit-item__content-icon--rectangle-large');
          element.addClass('unit-item__content-icon--text-stat');
          element.attr('style', manager.getBackgroundImg('new_stats', 'naval_attack_large_pg'));
          element.attr('title', 'naval attack against large targets using primary guns');
          subElement = $('<span></span>');
          subElement.text(data['naval_attack_large_pg']);
          manager.compareCoreAttribute(subElement, 'naval_attack_large_pg', data['naval_attack_large_pg']);
          element.append(subElement);
          contentRow.append(element);
        }

        // submarine attack
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--rectangle-large');
        element.addClass('unit-item__content-icon--text-stat');
        element.attr('style', manager.getBackgroundImg('old_stats', 'submarine_attack'));
        element.attr('title', 'attack against submarines');
        subElement = $('<span></span>');
        subElement.text(data['submarine_attack']);
        manager.compareCoreAttribute(subElement, 'submarine_attack', data['submarine_attack']);
        element.append(subElement);
        contentRow.append(element);

        // end content row
        unitElement.append(contentRow);

        // new content row
        contentRow = $('<div></div>');
        contentRow.addClass('unit-item__content-row');

        // vehicle defense
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--rectangle-large');
        element.addClass('unit-item__content-icon--text-stat');
        element.attr('style', manager.getBackgroundImg('old_stats', 'vehicle_defense'));
        element.attr('title', 'defense against vehicles');
        subElement = $('<span></span>');
        subElement.text(data['vehicle_defense']);
        manager.compareCoreAttribute(subElement, 'vehicle_defense', data['vehicle_defense']);
        element.append(subElement);
        contentRow.append(element);

        // infantry defense
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--rectangle-large');
        element.addClass('unit-item__content-icon--text-stat');
        element.attr('style', manager.getBackgroundImg('old_stats', 'infantry_defense'));
        element.attr('title', 'defense against infantry');
        subElement = $('<span></span>');
        subElement.text(data['infantry_defense']);
        manager.compareCoreAttribute(subElement, 'infantry_defense', data['infantry_defense']);
        element.append(subElement);
        contentRow.append(element);

        // artillery defense
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--rectangle-large');
        element.addClass('unit-item__content-icon--text-stat');
        element.attr('style', manager.getBackgroundImg('old_stats', 'bombard_defense'));
        element.attr('title', 'defense against artillery');
        subElement = $('<span></span>');
        subElement.text(data['artillery_defense']);
        manager.compareCoreAttribute(subElement, 'artillery_defense', data['artillery_defense']);
        element.append(subElement);
        contentRow.append(element);

        // air defense
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--rectangle-large');
        element.addClass('unit-item__content-icon--text-stat');
        element.attr('style', manager.getBackgroundImg('old_stats', 'air_defense'));
        element.attr('title', 'defense against air targets');
        subElement = $('<span></span>');
        subElement.text(data['air_defense']);
        manager.compareCoreAttribute(subElement, 'air_defense', data['air_defense']);
        element.append(subElement);
        contentRow.append(element);

        // naval defense
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--rectangle-large');
        element.addClass('unit-item__content-icon--text-stat');
        element.attr('style', manager.getBackgroundImg('old_stats', 'naval_defense'));
        element.attr('title', 'defense against naval targets');
        subElement = $('<span></span>');
        subElement.text(data['naval_defense']);
        manager.compareCoreAttribute(subElement, 'naval_defense', data['naval_defense']);
        element.append(subElement);
        contentRow.append(element);

        // torpedo defense
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--rectangle-large');
        element.addClass('unit-item__content-icon--text-stat');
        element.attr('style', manager.getBackgroundImg('old_stats', 'submarine_defense'));
        element.attr('title', 'defense against torpedo attacks');
        subElement = $('<span></span>');
        subElement.text(data['torpedo_defense']);
        manager.compareCoreAttribute(subElement, 'torpedo_defense', data['torpedo_defense']);
        element.append(subElement);
        contentRow.append(element);

        // land defense
        element = $('<div></div>');
        element.addClass('unit-item__content-icon');
        element.addClass('unit-item__content-icon--rectangle-large');
        element.addClass('unit-item__content-icon--text-stat');
        element.attr('style', manager.getBackgroundImg('new_stats', 'land_defense_ground'));
        element.attr('title', 'defense against land targets (anti-air or coastal guns)');
        subElement = $('<span></span>');
        subElement.text(data['land_defense']);
        manager.compareCoreAttribute(subElement, 'land_defense', data['land_defense']);
        element.append(subElement);
        contentRow.append(element);

        // end row
        unitElement.append(contentRow);

        // traits
        if (data['traits'].length > 0) {
          // new content row
          contentRow = $('<div></div>');
          contentRow.addClass('unit-item__content-row');

          const itemsList = data['traits'];

          for (let listIndex = 0; listIndex < itemsList.length; listIndex++) {
            const item = itemsList[listIndex];
            element = $('<div></div>');
            element.addClass('unit-item__label-gray');
            element.text(item['name']);
            element.attr('title', (item['info'] !== '') ? item['info'] : 'unit has '.concat(item['name'], ' trait'));
            contentRow.append(element);
          }

          // end content row
          unitElement.append(contentRow);
        }

        // transport
        if (data['transport'].length > 0) {
          // new content row
          contentRow = $('<div></div>');
          contentRow.addClass('unit-item__content-row');

          const itemsList = data['transport'];

          for (let listIndex = 0; listIndex < itemsList.length; listIndex++) {
            const item = itemsList[listIndex];
            element = $('<div></div>');
            element.addClass('unit-item__label-gray');

            if (item['id'] > -1) {
              const realName = manager.unitsData[item['id']]['name_real'];

              // transport unit is properly linked
              subElement = $('<a></a>');
              subElement.attr('href', manager.getUrlWithParams({f:{id : item['id']}}));
              subElement.text(realName);
              element.attr(
                  'title',
                  'unit may use '.concat(realName, ' as transport')
              );
            } else {
              // transport unit is not linked
              subElement = $('<span></span>');
              subElement.text(item['name']);
              element.attr(
                  'title',
                  'unit may use '.concat(item['name'], ' as transport (transport unit missing)')
              );
            }

            element.append(subElement);
            contentRow.append(element);
          }

          // end content row
          unitElement.append(contentRow);
        }

        // unit switch
        if (data['switch'].length > 0) {
          // new content row
          contentRow = $('<div></div>');
          contentRow.addClass('unit-item__content-row');

          const itemsList = data['switch'];

          for (let listIndex = 0; listIndex < itemsList.length; listIndex++) {
            const item = itemsList[listIndex];
            element = $('<div></div>');
            element.addClass('unit-item__content-icon');
            element.addClass('unit-item__content-icon--square-small');

            let backgroundImage = manager.getBackgroundImg('switch_action', item['img']);
            if (item['img'] !== item['action']) {
              backgroundImage = 'background-image: url("'.concat(
                  manager.getImgUrl('weapon_ability', item['action']),
                  '"), url("',
                  manager.getImgUrl('switch_action', item['img']),'")'
              );
            }
            element.attr('style', backgroundImage);

            if (item['id'] > -1) {
              const realName = manager.unitsData[item['id']]['name_real'];

              // switch unit is properly linked
              subElement = $('<a></a>');
              subElement.addClass('unit-item__image-link');
              subElement.attr('href', manager.getUrlWithParams({f:{id : item['id']}}));
              element.append(subElement);
              element.attr(
                  'title',
                  'unit may switch to '.concat(realName, ' using ', item['action'], ' action')
              );
            } else {
              // switch unit is not linked
              element.attr(
                  'title',
                  'unit may switch to '.concat(item['name'], ' using ', item['action'], ' action (switch unit missing)')
              );
            }

            contentRow.append(element);
          }

          // end content row
          unitElement.append(contentRow);
        }

        // unit carrier (explicit list of units that can carry this unit as a cargo)
        if (data['unit_carrier'].length > 0) {
          // new content row
          contentRow = $('<div></div>');
          contentRow.addClass('unit-item__content-row');

          const itemsList = data['unit_carrier'];

          for (let listIndex = 0; listIndex < itemsList.length; listIndex++) {
            const item = itemsList[listIndex];
            element = $('<div></div>');
            element.addClass('unit-item__label-gray');

            if (item['id'] > 0) {
              const realName = manager.unitsData[item['id']]['name_real'];

              // carrier unit is properly linked
              subElement = $('<a></a>');
              subElement.attr('href', manager.getUrlWithParams({f:{id : item['id']}}));
              subElement.text(realName);
              element.attr(
                  'title',
                  'unit can land on '.concat(realName, ' and be carried inside as a cargo')
              );
            } else {
              // carrier unit is not linked
              subElement = $('<span></span>');
              subElement.text(item['name']);
              element.attr(
                  'title',
                  'unit can land on '.concat(item['name'], ' and be carried inside as a cargo (carrier unit missing)')
              );
            }

            element.append(subElement);
            contentRow.append(element);
          }

          // end content row
          unitElement.append(contentRow);
        }

        // factions
        if (data['factions'].length > 0) {
          // new content row
          contentRow = $('<div></div>');
          contentRow.addClass('unit-item__content-row');

          const factions = data['factions'];

          for (let factionIndex = 0; factionIndex < factions.length; factionIndex++) {
            const faction = factions[factionIndex];
            element = $('<div></div>');
            element.addClass('unit-item__content-icon');
            element.addClass('unit-item__content-icon--rectangle-small');
            element.attr('style', manager.getBackgroundImg('faction', faction));
            let title = 'available for '.concat(faction, ' faction');

            // unit upgrade groups
            if (typeof data['series'][faction] !== 'undefined') {
              const unitUpgradeGroup = data['series'][faction];

              subElement = $('<a></a>');
              subElement.addClass('unit-item__image-link');
              subElement.attr('href', manager.getUrlWithParams({f:{id : unitUpgradeGroup.join(',')}}));
              element.append(subElement);
              title = title.concat(' (click to see unit upgrade group)');
            }

            element.attr('title', title);
            contentRow.append(element);
          }

          // end content row
          unitElement.append(contentRow);
        }

        // terrain

        // new content row
        contentRow = $('<div></div>');
        contentRow.addClass('unit-item__content-row');

        // toggle terrain button
        element = $('<button></button>');
        element.addClass('btn');
        element.addClass('btn-success');
        element.attr('name', 'toggle-terrain');
        element.attr('data-unit-id', id);
        element.text((manager.expandedTerrain.indexOf(id) < 0) ? 'Show terrain' : 'Hide terrain');
        element.click(function () {
          // show / hide terrain
          const state = $(this).text();
          const unitId = $(this).data('unit-id');

          if (state === 'Show terrain') {
            // show terrain
            $(this).text('Hide terrain');
            $(this).parents('.unit-item').find('.unit-item__terrain').removeClass('hidden');

            // add unit id to the list of expanded terrain items
            if (manager.expandedTerrain.indexOf(unitId) < 0) {
              manager.expandedTerrain.push(unitId);
            }
          } else {
            // hide terrain
            $(this).text('Show terrain');
            $(this).parents('.unit-item').find('.unit-item__terrain').addClass('hidden');

            // remove unit id from the list of expanded terrain items
            const indexToDelete = manager.expandedTerrain.indexOf(unitId);
            if (indexToDelete >= 0) {
              let expandedIds = [];
              for (let i = 0; i < manager.expandedTerrain.length; i++) {
                if (i !== indexToDelete) {
                  expandedIds.push(manager.expandedTerrain[i]);
                }
              }

              manager.expandedTerrain = expandedIds;
            }
          }
        });

        contentRow.append(element);

        // compare button
        element = $('<button></button>');
        element.addClass('btn');
        element.addClass('btn-warning');
        element.attr('name', 'compare-unit');
        element.attr('data-unit-id', id);
        element.text('Compare');
        element.click(function () {
          manager.startCompare($(this).data('unit-id'));
          manager.refreshPage();
        });
        contentRow.append(element);

        // end content row
        unitElement.append(contentRow);

        // new content row
        contentRow = $('<div></div>');
        contentRow.addClass('unit-item__content-row');
        contentRow.addClass('unit-item__terrain');

        if (manager.expandedTerrain.indexOf(id) < 0) {
          contentRow.addClass('hidden');
        }

        for (let climate in manager.terrain) {
          const climateData = manager.terrain[climate];

          for (let terrainName in climateData) {
            const terrainData = climateData[terrainName];

            let movement;
            let extraMovementData = '';
            if (typeof terrainData['movement'][data['chassis']] !== 'undefined') {
              const movementData = terrainData['movement'][data['chassis']];
              movement = manager.getTerrainPoints(data['movement'], movementData['points']);

              if (typeof movementData['road_factor_dirt'] !== 'undefined') {
                extraMovementData = extraMovementData.concat(
                    ', with dirt road ',
                    manager.getTerrainPoints(data['movement'], movementData['points'], movementData['road_factor_dirt']).toString(),
                    ' tiles'
                );
              }

              if (typeof movementData['road_factor_normal'] !== 'undefined') {
                extraMovementData = extraMovementData.concat(
                    ', with normal road ',
                    manager.getTerrainPoints(data['movement'], movementData['points'], movementData['road_factor_normal']).toString(),
                    ' tiles'
                );
              }
            } else {
              movement = 0;
            }

            let spotting;
            if (typeof terrainData['spotting'][data['category']] !== 'undefined') {
              spotting = terrainData['spotting'][data['category']];
              spotting = manager.getTerrainPoints(data['spotting'], spotting);
            } else {
              spotting = 0;
            }

            element = $('<div></div>');
            element.addClass('unit-item__label-terrain');
            element.addClass('unit-item__label-terrain-'.concat(climate));
            element.attr(
              'title',
              terrainName.concat(
                ' (',
                climate,
                ') terrain, movement: ',
                movement,
                ' tiles',
                extraMovementData,
                ', spotting through ',
                spotting,
                ' tiles'
              )
            );

            subElement = $('<div></div>');
            subElement.text(terrainName);
            element.append(subElement);
            subElement = $('<div></div>');
            subElement.text(' | ');

            let subText = $('<span></span>');
            subText.text(movement);
            manager.compareTerrainMovement(subText, climate, terrainName, movement);
            subElement.prepend(subText);
            subText = $('<span></span>');
            subText.text(spotting);
            manager.compareTerrainSpotting(subText, climate, terrainName, spotting);

            subElement.append(subText);
            element.append(subElement);

            contentRow.append(element);
          }
        }

        // end content row
        unitElement.append(contentRow);

        // element title tooltip
        unitElement.find('[title]').tooltip({
          classes: {
            'ui-tooltip': 'ui-corner-all ui-widget-shadow'
          },
          placement: 'auto bottom'
        });

        return unitElement;
      },

      /**
       * switch to unit compare mode
       *
       * @param {number} unitId
       */
      startCompare: function(unitId) {
        const manager = this;

        manager.compareId = unitId;

        // show clear compare button
        $('button[name="clear-compare"]').removeClass('hidden');
        const compareLabel = $('.compare-label');
        compareLabel.removeClass('hidden');

        const comparedUnit = manager.unitsData[unitId];
        compareLabel.find('span').text(comparedUnit['name_real']);
        compareLabel.attr('href', manager.getUrlWithParams({f:{id : comparedUnit['id']}}));
      },

      /**
       * exit unit compare mode
       */
      clearCompare: function () {
        const manager = this;

        manager.compareId = -1;
        $('button[name="clear-compare"]').addClass('hidden');

        const compareLabel = $('.compare-label');
        compareLabel.addClass('hidden');
        compareLabel.find('span').text('');
        compareLabel.attr('href', '');
      },

      /**
       * clear current page
       */
      clearPage: function () {
        const manager = this;

        $('#units-list').find('div').remove();
      },

      /**
       * refresh current page
       */
      refreshPage: function () {
        const manager = this;

        manager.clearPage();
        manager.loadPage();
        manager.updatePermalink();
      },

      /**
       * load first page
       */
      firstPage: function () {
        const manager = this;

        if (manager.currentPage === 1 || manager.pagesTotal === 0) {
          return;
        }

        manager.currentPage = 1;
        manager.refreshPage();
      },

      /**
       * load last page
       */
      lastPage: function () {
        const manager = this;

        if (manager.currentPage === manager.pagesTotal || manager.pagesTotal === 0) {
          return;
        }

        manager.currentPage = manager.pagesTotal;
        manager.refreshPage();
      },

      /**
       * load next page
       */
      nextPage: function () {
        const manager = this;

        // apply limit to pagination
        if (manager.currentPage >= manager.pagesTotal || manager.pagesTotal === 0) {
          return;
        }

        manager.currentPage+= 1;
        manager.refreshPage();
      },

      /**
       * load previous page
       */
      previousPage: function () {
        const manager = this;

        // apply limit to pagination
        if (manager.currentPage <= 1 || manager.pagesTotal === 0) {
          return;
        }

        manager.currentPage-= 1;
        manager.refreshPage();
      },

      /**
       * update permalink based on current filters and page
       */
      updatePermalink: function () {
        const params = {f:manager.filters, p:manager.currentPage};
        if (manager.compareId >= 0) {
          params['c'] = manager.compareId;
        }

        $('#filter-permalink').find('a').attr('href', manager.getUrlWithParams(params));
      },

      /**
       * apply single filter
       * @param {string} name
       * @param {string} value
       */
      applySingleFilter: function(name, value) {
        const manager = this;

        manager.addFilter(name, value);
        manager.applyFilters();
      },

      /**
       * add filter
       * @param {string} name
       * @param {string} value
       */
      addFilter: function(name, value) {
        const manager = this;

        // remove filter
        if (value === '') {
          delete manager.filters[name];
        }
        // add filter
        else {
          // remove unnecessary whitespace
          value = (typeof value === 'string') ? value.trim() : value;
          manager.filters[name] = value;
        }
      },

      /**
       * apply filter
       */
      applyFilters: function() {
        const manager = this;

        // detect no filters
        if (Object.keys(manager.filters).length === 0) {
          manager.unitsFiltered = manager.unitsOrder;
        }
        // filter items
        else {
          manager.unitsFiltered = [];
          for (let i = 0; i < manager.unitsOrder.length; i++) {
            const id = manager.unitsOrder[i];
            const unitData = manager.unitsData[id];

            // id filter
            if (typeof manager.filters['id'] !== 'undefined') {
              const idsInput = manager.filters['id'].toString().split(',');
              // reformat ids to proper type
              let ids = [];
              for (let idsIndex = 0; idsIndex < idsInput.length; idsIndex++) {
                ids.push(parseInt(idsInput[idsIndex]));
              }

              if (ids.indexOf(unitData['id']) < 0) {
                continue;
              }
            }

            // name filter
            if (typeof manager.filters['name'] !== 'undefined') {
              if (unitData['name_real'].toLowerCase().indexOf(manager.filters['name'].toLowerCase()) < 0) {
                continue;
              }
            }

            // category filter
            if (typeof manager.filters['category'] !== 'undefined') {
              if (unitData['category'] !== manager.filters['category']) {
                continue;
              }
            }

            // type filter
            if (typeof manager.filters['type'] !== 'undefined') {
              if (unitData['type'] !== manager.filters['type']) {
                continue;
              }
            }

            // chassis filter
            if (typeof manager.filters['chassis'] !== 'undefined') {
              if (unitData['chassis'] !== manager.filters['chassis']) {
                continue;
              }
            }

            // faction filter
            if (typeof manager.filters['faction'] !== 'undefined') {
              if (unitData['factions'].indexOf(manager.filters['faction']) < 0) {
                continue;
              }
            }

            // available filter
            if (typeof manager.filters['available'] !== 'undefined') {
              const available = new Date(manager.filters['available']).getTime();

              if (
                  (unitData['available'] !== '' && (parseInt(unitData['available']) * 1000) > available)
                  || (unitData['expire'] !== '' && (parseInt(unitData['expire']) * 1000) < available)
                  ) {
                continue;
              }
            }

            manager.unitsFiltered.push(id);
          }
        }

        // clear all expanded terrain data
        manager.expandedTerrain = [];

        manager.refreshPagination();
        manager.refreshPage();
      },

      /**
       * clear all filters
       */
      clearFilters: function() {
        const manager = this;

        manager.filters = {};
        manager.unitsFiltered = manager.unitsOrder;

        // clear all expanded terrain data
        manager.expandedTerrain = [];

        manager.refreshPagination();
        manager.refreshPage();
      },

      /**
       * refresh pagination
       */
      refreshPagination: function() {
        const manager = this;

        manager.pagesTotal = Math.ceil(manager.unitsFiltered.length / manager.itemsPerPage);

        if (manager.suggestedPage > 0) {
          // process suggested page
          manager.currentPage = Math.max(1, Math.min(manager.pagesTotal, manager.suggestedPage));
          manager.suggestedPage = 0;

        } else {
          // reset current page
          manager.currentPage = 1;
        }

        $('#pages-total').text(manager.pagesTotal);
        $('#current-page').text(manager.currentPage);

        $('#pages-total-bottom').text(manager.pagesTotal);
        $('#current-page-bottom').text(manager.currentPage);
      }
    };

    // main init call
    manager.initData(function () {
      // hide spinner
      $('#spinner').addClass('hidden');

      // show units table
      $('#units-list').removeClass('hidden');

      // show navigation bar
      $('.navigation-bar').removeClass('hidden');

      // show filter bar
      $('.filter-bar').removeClass('hidden');

      // first page button
      $('.first-page').click(function (e) {
        e.preventDefault();
        manager.firstPage();
      });

      // last page button
      $('.last-page').click(function (e) {
        e.preventDefault();
        manager.lastPage();
      });

      // next page button
      $('.next-page').click(function (e) {
        e.preventDefault();
        manager.nextPage();
      });

      // previous page button
      $('.previous-page').click(function (e) {
        e.preventDefault();
        manager.previousPage();
      });

      // unit id filter
      $('input[name="filter-unit-id"]').keyup(function () {
        manager.applySingleFilter('id', $(this).val());
      });

      // unit name filter
      $('input[name="filter-unit-name"]').keyup(function () {
        manager.applySingleFilter('name', $(this).val());
      });

      // category filter
      $('select[name="filter-category"]').change(function () {
        manager.applySingleFilter('category', $(this).val());
      });

      // type filter
      $('select[name="filter-type"]').change(function () {
        manager.applySingleFilter('type', $(this).val());
      });

      // chassis filter
      $('select[name="filter-chassis"]').change(function () {
        manager.applySingleFilter('chassis', $(this).val());
      });

      // faction filter
      $('select[name="filter-faction"]').change(function () {
        manager.applySingleFilter('faction', $(this).val());
      });

      // available filter
      $('input[name="filter-available"]').change(function () {
        manager.applySingleFilter('available', $(this).val());
      });

      // clear filters button
      $('button[name="clear-filters"]').click(function () {
        // clear inputs
        $('input[name="filter-unit-id"]').val('');
        $('input[name="filter-unit-name"]').val('');
        $('select[name="filter-category"]').val('');
        $('select[name="filter-type"]').val('');
        $('select[name="filter-chassis"]').val('');
        $('select[name="filter-faction"]').val('');
        $('input[name="filter-available"]').val('');

        manager.clearFilters();
      });

      $('button[name="clear-compare"]').click(function () {
        manager.clearCompare();
        manager.refreshPage();
      });
    });
  });
}
