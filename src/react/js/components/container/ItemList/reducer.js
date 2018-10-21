import {
  LIST_TOGGLE_TERRAIN,
} from './actions';

const reducerItemList = (state = { terrainToggle: [] }, action) => {
  switch (action.type) {
    case LIST_TOGGLE_TERRAIN: {
      const unitId = action.unitId;
      const terrainToggle = state.terrainToggle;
      const position = terrainToggle.indexOf(unitId);

      if (position >= 0) {
        // terrain view is open - close it
        terrainToggle.splice(position, 1);
      } else {
        // terrain view is closed - open it
        terrainToggle.push(unitId);
      }

      return {
        ...state,
        terrainToggle,
      };
    }
    default:
      return state;
  }
};

export default reducerItemList;
