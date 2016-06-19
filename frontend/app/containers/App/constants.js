/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const LOAD_CITY_DATA = 'boilerplate/App/LOAD_CITY_DATA';
export const LOAD_CITY_DATA_SUCCESS = 'boilerplate/App/LOAD_CITY_DATA_SUCCESS';
export const LOAD_CITY_DATA_ERROR = 'boilerplate/App/LOAD_CITY_DATA_ERROR';

export const LOAD_MOOD_DATA = 'boilerplate/App/SUBMIT_MOOD_DATA';
export const LOAD_MOOD_DATA_ERROR = 'boilerplate/App/SUBMIT_MOOD_DATA_ERROR';
export const LOAD_MOOD_DATA_SUCCESS = 'boilerplate/App/SUBMIT_MOOD_DATA_SUCCESS';
