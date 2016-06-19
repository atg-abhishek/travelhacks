/*
 *
 * MapResults reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  SELECT_MARKER,
} from './constants';

const initialState = fromJS({});

function mapResultsReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;

    case SELECT_MARKER:
      return state
        .set('selectedMarker', action.marker);

    default:
      return state;
  }
}

export default mapResultsReducer;
