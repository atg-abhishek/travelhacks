/*
 *
 * MapResults actions
 *
 */

import {
  DEFAULT_ACTION,
  SELECT_MARKER,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function selectMarker(marker) {
  return {
    type: SELECT_MARKER,
    marker,
  };
}
