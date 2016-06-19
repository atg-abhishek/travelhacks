import { createSelector } from 'reselect';

/**
 * Direct selector to the emotionPage state domain
 */
const selectEmotionPageDomain = () => state => state.get('emotionPage');

/**
 * Other specific selectors
 */


/**
 * Default selector used by EmotionPage
 */

const selectEmotionPage = () => createSelector(
  selectEmotionPageDomain(),
  (substate) => substate.toJS()
);

const selectEmotions = () => createSelector(
  selectEmotionPageDomain(),
  (substate) => substate.get('emotions')
);

export default selectEmotionPage;
export {
  selectEmotionPageDomain,
  selectEmotions,
};
