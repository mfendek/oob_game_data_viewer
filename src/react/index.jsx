import React from 'react';
import { render } from 'react-dom';
import UnitNavigator from './js/components/container/UnitNavigator';

// bootstrap Unit Navigator
const wrapper = document.getElementById('unit-navigator-wrapper');
if (wrapper) {
  const data = JSON.parse(wrapper.firstElementChild.innerHTML);
  render(<UnitNavigator data={data} />, wrapper);
}
