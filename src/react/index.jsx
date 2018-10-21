import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './js/reducers';
import UnitNavigator from './js/components/container/UnitNavigator/UnitNavigator';

// bootstrap Unit Navigator
const wrapper = document.getElementById('unit-navigator-wrapper');
if (wrapper) {
  const store = createStore(
    rootReducer,
    applyMiddleware(thunk),
  );
  render(
    <Provider store={store}>
      <UnitNavigator />
    </Provider>,
    wrapper,
  );
}
