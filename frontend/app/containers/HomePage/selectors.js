/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectHome = () => (state) => state.get('home');

const selectUsername = () => createSelector(
  selectHome(),
  (homeState) => homeState.get('username')
);

const selectCity = () => createSelector(
  selectHome(),
  (homeState) => homeState.get('city')
);

export {
  selectHome,
  selectUsername,
  selectCity,
};
