import React from 'react';
import PropTypes from 'prop-types';
import ReactImageFallback from 'react-image-fallback';
import ReactTooltip from 'react-tooltip';
import { getImgUrl } from '../../utils/ImagePath';
import { formatDate } from '../../utils/DateFormat';
import TitleLabel from './label/TitleLabel';
import SquareImageIcon from './icon/SquareImageIcon';
import SquareTextIcon from './icon/SquareTextIcon';
import CompositeImageIcon from './icon/CompositeImageIcon';
import TextLabel from './label/TextLabel';
import RectangleTextIcon from './icon/RectangleTextIcon';
import LinkLabel from './label/LinkLabel';
import LinkIcon from './icon/LinkIcon';
import TerrainLabel from './label/TerrainLabel';

/**
 * Item detail
 *
 * @param {Object} data
 * @param {Object} terrain
 * @param {bool} terrainOpen
 * @param {function} compareCoreAttr
 * @param {function} compareTerrainMovement
 * @param {function} compareTerrainSpotting
 * @param {function} lookup
 * @param {function} startCompare
 * @param {function} toggleTerrain
 * @param {string} imageKey
 * @constructor
 */
const ItemDetail = (
  {
    data,
    terrain,
    terrainOpen,
    compareCoreAttr,
    compareTerrainMovement,
    compareTerrainSpotting,
    lookup,
    startCompare,
    toggleTerrain,
    imageKey,
  },
) => (
  <div className="unit-item">
    <div className="unit-item__content-row">
      <TitleLabel data={data} />
      <SquareImageIcon name="category" value={data.category} title={data.category.concat(' unit category')} />
      <SquareImageIcon name="type" value={data.type} title={data.type.concat(' unit type')} />
      <SquareImageIcon name="chassis" value={data.chassis} title={'unit has '.concat(data.chassis, ' movement type')} />

      <SquareTextIcon
        name="cost"
        value={data.cost}
        title={'unit costs '.concat(data.cost.toString(), ' resource points')}
        compare={compareCoreAttr}
        reversedCompare
        breakLine
      />

      <SquareTextIcon
        name="supply"
        value={data.supply}
        title={'unit uses '.concat(data.supply.toString(), ' ', data.category, ' supply')}
        compare={compareCoreAttr}
        reversedCompare
        imgName="category"
        imgValue={data.category}
      />

      {data.carrier.map(
        (item) => <SquareImageIcon key={item} name="carrier" value={item} title={'unit can land on '.concat(item)} />,
      )}

      <SquareImageIcon
        name="specialisation"
        value={data.specialisation}
        title={'unit requires '.concat(data.specialisation, ' specialisation')}
      />

      {data.switch.map(
        (item) => <CompositeImageIcon key={item.id} data={item} lookup={lookup} />,
      )}
    </div>

    <div className="unit-item__content-row">
      <div className="unit-item__unit-image">
        <ReactImageFallback
          src={getImgUrl('unit_image', data.name).concat('?v=', imageKey)}
          initialImage={getImgUrl('unit_image', 'placeholder')}
          fallbackImage={getImgUrl('unit_image', 'no_image')}
          alt=""
        />
      </div>

      <div className="unit-item__details-list">
        <TextLabel
          color="green"
          text={(data.available !== '') ? formatDate(data.available) : 'always'}
          title="available on"
        />

        <TextLabel
          color="red"
          text={(data.expire !== '') ? formatDate(data.expire) : 'never'}
          title="expires on"
        />

        <TextLabel
          color="red"
          text={data.attack_type}
          title="attack type"
        />

        <TextLabel
          color="green"
          text={data.defense_type}
          title="defense type"
        />
      </div>
    </div>

    <div className="unit-item__content-row">
      <RectangleTextIcon
        name="movement"
        value={data.movement}
        title={'unit has '.concat(data.movement.toString(), ' movement points')}
        compare={compareCoreAttr}
        imgName="old_stats"
        imgValue="mp"
      />

      <RectangleTextIcon
        name="spotting"
        value={data.spotting}
        title={'unit has '.concat(data.spotting.toString(), ' spotting points (adjacent tiles are always visible)')}
        compare={compareCoreAttr}
        imgName="new_stats"
        imgValue="spotting"
      />

      <RectangleTextIcon
        name="actions"
        value={data.actions}
        title={'unit has '.concat(data.actions.toString(), ' actions')}
        compare={compareCoreAttr}
        imgName="new_stats"
        imgValue="actions"
      />

      <RectangleTextIcon
        name="steps"
        value={data.steps}
        title={'unit has '.concat(data.steps.toString(), ' steps')}
        compare={compareCoreAttr}
        imgName="new_stats"
        imgValue="steps"
      />

      <RectangleTextIcon
        name="range"
        value={data.range}
        title={'unit can attack other units within '.concat(data.range.toString(), ' tiles')}
        compare={compareCoreAttr}
        imgName="old_stats"
        imgValue="range"
        allowZeroValue={false}
      />

      <RectangleTextIcon
        name="shock"
        value={data.shock}
        title="shock damages enemy efficiency"
        compare={compareCoreAttr}
        imgName="old_stats"
        imgValue="shock"
        allowZeroValue={false}
      />

      <RectangleTextIcon
        name="assault"
        value={data.assault}
        title="assault damages enemy entrenchment"
        compare={compareCoreAttr}
        imgName="old_stats"
        imgValue="assault"
        allowZeroValue={false}
      />

      <RectangleTextIcon
        name="fuel"
        value={data.fuel}
        title={
          (data.category === 'air') ? 'unit can stay airborne for '.concat(data.fuel.toString(), ' turns')
            : (data.category === 'land') ? 'unit is supply immune for '.concat(data.fuel.toString(), ' turns')
              : (data.category === 'naval') ? 'unit can stay submerged for '.concat(data.fuel.toString(), ' turns')
                : ''
        }
        compare={compareCoreAttr}
        imgName="new_stats"
        imgValue="fuel"
        allowZeroValue={false}
      />

      <RectangleTextIcon
        name="radar"
        value={data.radar}
        title={'unit can spot radar targets within '.concat(data.radar.toString(), ' tiles')}
        compare={compareCoreAttr}
        imgName="new_stats"
        imgValue="radar"
        allowZeroValue={false}
      />

      <RectangleTextIcon
        name="cargo"
        value={data.cargo}
        title={'unit can carry '.concat(data.cargo.toString(), ' other units inside')}
        compare={compareCoreAttr}
        imgName="new_stats"
        imgValue="cargo"
        allowZeroValue={false}
      />

      <RectangleTextIcon
        name="torpedo_attack"
        value={data.torpedo_attack}
        title={'unit has '.concat(data.torpedo_attack.toString(), ' torpedo attack')}
        compare={compareCoreAttr}
        imgName="new_stats"
        imgValue="torpedo_attack"
        allowZeroValue={false}
      />

      <RectangleTextIcon
        name="torpedo_range"
        value={data.torpedo_range}
        title={'unit can attack other units with torpedo within '.concat(data.torpedo_range.toString(), ' tiles')}
        compare={compareCoreAttr}
        imgName="new_stats"
        imgValue="torpedo_range"
        allowZeroValue={false}
      />

      <RectangleTextIcon
        name="torpedo_cool_down"
        value={data.torpedo_cool_down}
        title={'it takes this unit '.concat(data.torpedo_cool_down.toString(), ' turns to reload the torpedo')}
        compare={compareCoreAttr}
        imgName="new_stats"
        imgValue="torpedo_cool_down"
        allowZeroValue={false}
        reversedCompare
      />

      <RectangleTextIcon
        name="bombardment"
        value={data.bombardment}
        title="bombardment damages infrastructure"
        compare={compareCoreAttr}
        imgName="new_stats"
        imgValue="bombardment"
        allowZeroValue={false}
      />

      <RectangleTextIcon
        name="blast"
        value={data.blast}
        title={'unit also attacks all units within '.concat(data.blast.toString(), ' tiles radius from the target tile')}
        compare={compareCoreAttr}
        imgName="new_stats"
        imgValue="blast"
        allowZeroValue={false}
      />
    </div>
    <div className="unit-item__content-row">
      <RectangleTextIcon
        name="vehicle_attack"
        value={data.vehicle_attack}
        title="vehicle attack"
        compare={compareCoreAttr}
        imgName="old_stats"
        imgValue="vehicle_attack"
      />

      <RectangleTextIcon
        name="vehicle_close_attack"
        value={data.vehicle_close_attack}
        title={'vehicle close attack (the higher the cover of the battlefield'
          .concat(' the closer is the attack value to the close attack value)')}
        compare={compareCoreAttr}
        imgName="new_stats"
        imgValue="vehicle_close_attack"
      />

      <RectangleTextIcon
        name="infantry_attack"
        value={data.infantry_attack}
        title="infantry attack"
        compare={compareCoreAttr}
        imgName="old_stats"
        imgValue="infantry_attack"
      />

      <RectangleTextIcon
        name="infantry_close_attack"
        value={data.infantry_close_attack}
        title={'infantry close attack (the higher the cover of the battlefield'
          .concat(' the closer is the attack value to the close attack value)')}
        compare={compareCoreAttr}
        imgName="new_stats"
        imgValue="infantry_close_attack"
      />

      <RectangleTextIcon
        name="air_attack_small"
        value={data.air_attack_small}
        title="air attack against small targets"
        compare={compareCoreAttr}
        imgName="old_stats"
        imgValue="air_small_attack"
      />

      <RectangleTextIcon
        name="air_attack_large"
        value={data.air_attack_large}
        title="air attack against large targets"
        compare={compareCoreAttr}
        imgName="old_stats"
        imgValue="air_large_attack"
      />

      <RectangleTextIcon
        name="naval_attack_small"
        value={data.naval_attack_small}
        title="naval attack against small targets"
        compare={compareCoreAttr}
        imgName="old_stats"
        imgValue="naval_small_attack"
      />

      <RectangleTextIcon
        name="naval_attack_small_pg"
        value={data.naval_attack_small_pg}
        title="naval attack against small targets using primary guns"
        compare={compareCoreAttr}
        imgName="new_stats"
        imgValue="naval_attack_small_pg"
        allowZeroValue={false}
      />

      <RectangleTextIcon
        name="naval_attack_large"
        value={data.naval_attack_large}
        title="naval attack against large targets"
        compare={compareCoreAttr}
        imgName="old_stats"
        imgValue="naval_large_attack"
      />

      <RectangleTextIcon
        name="naval_attack_large_pg"
        value={data.naval_attack_large_pg}
        title="naval attack against large targets using primary guns"
        compare={compareCoreAttr}
        imgName="new_stats"
        imgValue="naval_attack_large_pg"
        allowZeroValue={false}
      />

      <RectangleTextIcon
        name="submarine_attack"
        value={data.submarine_attack}
        title="attack against submarines"
        compare={compareCoreAttr}
        imgName="old_stats"
        imgValue="submarine_attack"
      />
    </div>
    <div className="unit-item__content-row">
      <RectangleTextIcon
        name="vehicle_defense"
        value={data.vehicle_defense}
        title="defense against vehicles"
        compare={compareCoreAttr}
        imgName="old_stats"
        imgValue="vehicle_defense"
      />

      <RectangleTextIcon
        name="infantry_defense"
        value={data.infantry_defense}
        title="defense against infantry"
        compare={compareCoreAttr}
        imgName="old_stats"
        imgValue="infantry_defense"
      />

      <RectangleTextIcon
        name="artillery_defense"
        value={data.artillery_defense}
        title="defense against artillery"
        compare={compareCoreAttr}
        imgName="old_stats"
        imgValue="bombard_defense"
      />

      <RectangleTextIcon
        name="air_defense"
        value={data.air_defense}
        title="defense against air targets"
        compare={compareCoreAttr}
        imgName="old_stats"
        imgValue="air_defense"
      />

      <RectangleTextIcon
        name="naval_defense"
        value={data.naval_defense}
        title="defense against naval targets"
        compare={compareCoreAttr}
        imgName="old_stats"
        imgValue="naval_defense"
      />

      <RectangleTextIcon
        name="torpedo_defense"
        value={data.torpedo_defense}
        title="defense against torpedo attacks"
        compare={compareCoreAttr}
        imgName="old_stats"
        imgValue="submarine_defense"
      />

      <RectangleTextIcon
        name="land_defense"
        value={data.land_defense}
        title="defense against land targets (anti-air or coastal guns)"
        compare={compareCoreAttr}
        imgName="new_stats"
        imgValue="land_defense_ground"
      />
    </div>

    {
      data.traits.length > 0
      && (
        <div className="unit-item__content-row">
          {
            data.traits.map(
              (item) => (
                <TextLabel
                  key={item.name}
                  color="gray"
                  text={item.name}
                  title={(item.info !== '') ? item.info : 'unit has '.concat(item.name, ' trait')}
                />
              ),
            )
          }
        </div>
      )
    }

    {
      data.transport.length > 0
      && (
        <div className="unit-item__content-row">
          {
            data.transport.map(
              (item) => (
                <LinkLabel
                  key={item.name}
                  color="gray"
                  title="unit may use $s as transport"
                  altTitle={'unit may use '.concat(item.name, ' as transport (transport unit missing)')}
                  data={item}
                  lookup={lookup}
                />
              ),
            )
          }
        </div>
      )
    }

    {
      data.unit_carrier.length > 0
      && (
        <div className="unit-item__content-row">
          {
            data.unit_carrier.map(
              (item) => (
                <LinkLabel
                  key={item.name}
                  color="gray"
                  title="unit can land on $s and be carried inside as a cargo"
                  altTitle={'unit can land on '.concat(item.name, ' and be carried inside as a cargo (carrier unit missing)')}
                  data={item}
                  lookup={lookup}
                />
              ),
            )
          }
        </div>
      )
    }

    {
      data.factions.length > 0
      && (
        <div className="unit-item__content-row">
          {
            data.factions.map(
              (faction) => (
                <LinkIcon
                  key={faction}
                  title={
                    'available for '.concat(
                      faction, ' faction',
                      (typeof data.series[faction] !== 'undefined') ? ' (click to see unit upgrade group)' : '',
                    )
                  }
                  imgName="faction"
                  imgValue={faction}
                  link={(typeof data.series[faction] !== 'undefined') ? data.series[faction].join(',') : ''}
                />
              ),
            )
          }
        </div>
      )
    }

    <div className="unit-item__content-row">
      <button
        type="button"
        className="btn btn-success"
        name="compare-unit"
        onClick={() => { toggleTerrain(data.id); }}
      >
        {terrainOpen ? 'Hide terrain' : 'Show terrain'}
      </button>

      <button
        type="button"
        className="btn btn-warning"
        name="compare-unit"
        onClick={() => { startCompare(data.id); }}
      >
        Compare
      </button>
    </div>

    {
      terrainOpen && Object.keys(terrain).length > 0
      && (
        <div className="unit-item__content-row">
          {
            Object.keys(terrain).map(
              (terrainName) => (
                <TerrainLabel
                  key={terrainName}
                  terrainName={terrainName}
                  data={data}
                  terrain={terrain[terrainName]}
                  compareMovement={compareTerrainMovement}
                  compareSpotting={compareTerrainSpotting}
                />
              ),
            )
          }
          <ReactTooltip type="dark" place="bottom" effect="solid" />
        </div>
      )
    }

    <ReactTooltip type="dark" place="bottom" effect="solid" />
  </div>
);

ItemDetail.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    cost: PropTypes.number.isRequired,
    supply: PropTypes.number.isRequired,
    chassis: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    specialisation: PropTypes.string.isRequired,
    expire: PropTypes.string.isRequired,
    attack_type: PropTypes.string.isRequired,
    defense_type: PropTypes.string.isRequired,
    actions: PropTypes.number.isRequired,
    steps: PropTypes.number.isRequired,
    shock: PropTypes.number.isRequired,
    assault: PropTypes.number.isRequired,
    fuel: PropTypes.number.isRequired,
    radar: PropTypes.number.isRequired,
    cargo: PropTypes.number.isRequired,
    torpedo_attack: PropTypes.number.isRequired,
    torpedo_range: PropTypes.number.isRequired,
    torpedo_cool_down: PropTypes.number.isRequired,
    bombardment: PropTypes.number.isRequired,
    blast: PropTypes.number.isRequired,
    vehicle_attack: PropTypes.number.isRequired,
    vehicle_close_attack: PropTypes.number.isRequired,
    infantry_attack: PropTypes.number.isRequired,
    infantry_close_attack: PropTypes.number.isRequired,
    air_attack_small: PropTypes.number.isRequired,
    air_attack_large: PropTypes.number.isRequired,
    naval_attack_small: PropTypes.number.isRequired,
    naval_attack_small_pg: PropTypes.number.isRequired,
    naval_attack_large: PropTypes.number.isRequired,
    naval_attack_large_pg: PropTypes.number.isRequired,
    submarine_attack: PropTypes.number.isRequired,
    vehicle_defense: PropTypes.number.isRequired,
    infantry_defense: PropTypes.number.isRequired,
    artillery_defense: PropTypes.number.isRequired,
    air_defense: PropTypes.number.isRequired,
    naval_defense: PropTypes.number.isRequired,
    torpedo_defense: PropTypes.number.isRequired,
    land_defense: PropTypes.number.isRequired,
    series: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    carrier: PropTypes.arrayOf(PropTypes.string).isRequired,
    factions: PropTypes.arrayOf(PropTypes.string).isRequired,
    transport: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
    unit_carrier: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
    traits: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      info: PropTypes.string.isRequired,
    })).isRequired,
    switch: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
      img: PropTypes.string.isRequired,
      inner: PropTypes.bool.isRequired,
    })).isRequired,
  }).isRequired,
  terrain: PropTypes.objectOf(PropTypes.objectOf(PropTypes.shape({
    movement: PropTypes.objectOf(PropTypes.shape({
      points: PropTypes.number.isRequired,
      road_factor_dirt: PropTypes.number,
      road_factor_normal: PropTypes.number,
    })),
    spotting: PropTypes.objectOf(PropTypes.number),
  }))).isRequired,
  terrainOpen: PropTypes.bool.isRequired,
  compareCoreAttr: PropTypes.func.isRequired,
  compareTerrainMovement: PropTypes.func.isRequired,
  compareTerrainSpotting: PropTypes.func.isRequired,
  lookup: PropTypes.func.isRequired,
  startCompare: PropTypes.func.isRequired,
  toggleTerrain: PropTypes.func.isRequired,
  imageKey: PropTypes.string.isRequired,
};

export default ItemDetail;
