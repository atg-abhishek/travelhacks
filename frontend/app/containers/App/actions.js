/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your appliction state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  LOAD_CITY_DATA,
  LOAD_CITY_DATA_SUCCESS,
  LOAD_CITY_DATA_ERROR,
  LOAD_MOOD_DATA,
  LOAD_MOOD_DATA_ERROR,
  LOAD_MOOD_DATA_SUCCESS,
} from './constants';

/**
 * Load the repositories, this action starts the request saga
 *
 * @return {object} An action object with a type of LOAD_REPOS
 */
export function loadCityData() {
  return {
    type: LOAD_CITY_DATA,
  };
}

/**
 * Dispatched when the city data is loaded by the request saga
 *
 * @param  {array} repos The repository data
 * @param  {string} username The current username
 *
 * @return {object}      An action object with a type of LOAD_REPOS_SUCCESS passing the repos
 */
export function cityDataLoaded(cityData) {
  return {
    type: LOAD_CITY_DATA_SUCCESS,
    cityData,
  };
}

/**
 * Dispatched when loading the city data fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of LOAD_REPOS_ERROR passing the error
 */
export function cityDataLoadingError(error) {
  return {
    type: LOAD_CITY_DATA_ERROR,
    error,
  };
}

/**
 * Load the repositories, this action starts the request saga
 *
 * @return {object} An action object with a type of LOAD_REPOS
 */
export function loadMoodData() {
  return {
    type: LOAD_MOOD_DATA,
  };
}

/**
 * Dispatched when the city data is loaded by the request saga
 *
 * @param  {array} repos The repository data
 * @param  {string} username The current username
 *
 * @return {object}      An action object with a type of LOAD_REPOS_SUCCESS passing the repos
 */
export function moodDataLoaded(moodData) {
  return {
    type: LOAD_MOOD_DATA_SUCCESS,
    moodData,
  };
}

/**
 * Dispatched when loading the mood data fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of LOAD_REPOS_ERROR passing the error
 */
export function moodDataLoadingError(error) {
  return {
    type: LOAD_MOOD_DATA_ERROR,
    error,
  };
}
