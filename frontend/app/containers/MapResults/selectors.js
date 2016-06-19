import { createSelector } from 'reselect';

/**
 * Direct selector to the mapResults state domain
 */
const selectMapResultsDomain = () => state => state.get('mapResults');

/**
 * Other specific selectors
 */


/**
 * Default selector used by MapResults
 */

const selectMapResults = () => createSelector(
  selectMapResultsDomain(),
  (substate) => substate.toJS()
);

const selectCurrentMarker = () => createSelector(
  selectMapResultsDomain(),
  (substate) => substate.get('selectedMarker')
);

export default selectMapResults;
export {
  selectMapResultsDomain,
  selectCurrentMarker,
};
