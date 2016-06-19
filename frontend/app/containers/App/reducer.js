/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import {
  LOAD_CITY_DATA_SUCCESS,
  LOAD_CITY_DATA,
  LOAD_CITY_DATA_ERROR,
  LOAD_MOOD_DATA,
  LOAD_MOOD_DATA_SUCCESS,
  LOAD_MOOD_DATA_ERROR,
} from './constants';
import { fromJS } from 'immutable';

// The initial state of the App
const initialState = fromJS({
  loading: false,
  error: false,
  currentUser: false,
  cityData: fromJS({
    initialData: false,
  }),
  moodData: fromJS({
    initialData: false,
  }),
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_CITY_DATA:
      return state
        .set('loading', true)
        .set('error', false)
        .setIn(['cityData', 'initialData'], false);
    case LOAD_CITY_DATA_SUCCESS:
      return state
        .setIn(['cityData', 'initialData'], action.cityData)
        .set('loading', false)
        .set('currentUser', action.username);
    case LOAD_CITY_DATA_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    case LOAD_MOOD_DATA:
      return state
        .set('loading', true)
        .set('error', false)
        .setIn(['moodData', 'initialData'], false);
    case LOAD_MOOD_DATA_SUCCESS:
      return state
        .setIn(['moodData', 'initialData'], action.moodData)
        .set('loading', false);
        // .set('currentUser', action.username);
    case LOAD_MOOD_DATA_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);

    default:
      return state;
  }
}

export default appReducer;
