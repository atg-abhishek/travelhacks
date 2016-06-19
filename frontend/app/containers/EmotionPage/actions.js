/*
 *
 * EmotionPage actions
 *
 */

import {
  DEFAULT_ACTION,
  SELECT_EMOTION,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function selectEmotion(id) {
  return {
    type: SELECT_EMOTION,
    id,
  };
}
