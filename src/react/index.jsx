import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './js/reducers';
import UnitNavigator from './js/components/container/UnitNavigator';

// bootstrap Unit Navigator
const wrapper = document.getElementById('unit-navigator-wrapper');
if (wrapper) {
  const store = createStore(rootReducer);
  render(
    <Provider store={store}>
      <UnitNavigator />
    </Provider>,
    wrapper,
  );
}
