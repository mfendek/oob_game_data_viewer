import { combineReducers } from 'redux';
import reducerUnitNavigator from './components/container/UnitNavigator/reducer';
import reducerItemList from './components/container/ItemList/reducer';

export default combineReducers({
  reducerUnitNavigator,
  reducerItemList,
});
