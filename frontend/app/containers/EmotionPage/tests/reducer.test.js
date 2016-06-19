import expect from 'expect';
import emotionPageReducer from '../reducer';
import { fromJS } from 'immutable';

describe('emotionPageReducer', () => {
  it('returns the initial state', () => {
    expect(emotionPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
