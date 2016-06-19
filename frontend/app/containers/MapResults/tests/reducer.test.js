import expect from 'expect';
import mapResultsReducer from '../reducer';
import { fromJS } from 'immutable';

describe('mapResultsReducer', () => {
  it('returns the initial state', () => {
    expect(mapResultsReducer(undefined, {})).toEqual(fromJS({}));
  });
});
