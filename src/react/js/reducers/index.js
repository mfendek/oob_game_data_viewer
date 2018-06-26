import { combineReducers } from 'redux';
import reducerUnitNavigator from './UnitNavigator';
import reducerItemList from './ItemList';

export default combineReducers({
  reducerUnitNavigator,
  reducerItemList,
});
