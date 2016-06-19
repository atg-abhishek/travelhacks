/*
 *
 * EmotionPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  SELECT_EMOTION,
} from './constants';


//  emotions: ['Relaxed', 'Adventerous', 'Comical', 'Artisy', 'Romantic', 'Nerdy'];

const initialState = fromJS({
  emotions: [
    {
      id: 1,
      name: 'relaxed',
      toggled: false,
    },
    {
      id: 2,
      name: 'adventurous',
      toggled: false,
    },
    {
      id: 3,
      name: 'comical',
      toggled: false,
    },
    {
      id: 4,
      name: 'artsy',
      toggled: false,
    },
    {
      id: 5,
      name: 'romantic',
      toggled: false,
    },
    {
      id: 6,
      name: 'nerdy',
      toggled: false,
    },
  ],
});

function emotionPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;

    case SELECT_EMOTION: //eslint-disable-line
      const emotions = state.get('emotions').toJS();
      emotions.map((val) => {
        if (val.id === action.id) {
          val.toggled = !val.toggled;
          return val;
        } else {
          return val;
        }
      });
      return state
        .set('emotions', fromJS(emotions));
    default:
      return state;
  }
}

export default emotionPageReducer;
