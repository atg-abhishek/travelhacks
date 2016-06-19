/**
 * Gets the repositories of the user from Github
 */

import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { LOAD_CITY_DATA } from 'containers/App/constants';
import { cityDataLoaded, cityDataLoadingError } from 'containers/App/actions';

import request from 'utils/request';
import { selectCity } from 'containers/HomePage/selectors';

/**
 * Github repos request/response handler
 */
export function* getCityInfo() {
  // Select username from store
  const cityData = yield select(selectCity());

  const requestURL = 'http://ec2-52-87-240-146.compute-1.amazonaws.com:23001/getCityInfo';

  const formData = new FormData();

  formData.append('lat', cityData.location.lat);
  formData.append('lng', cityData.location.lng);

  // Call our request helper (see 'utils/request')
  const repos = yield call(request, requestURL,
    {
      method: 'post',
      body: formData,
    }
  );

  if (!repos.err) {
    yield put(cityDataLoaded(repos.data));
  } else {
    yield put(cityDataLoadingError(repos.err));
  }
}

/**
 * Watches for LOAD_REPOS action and calls handler
 */
export function* getReposWatcher() {
  while (yield take(LOAD_CITY_DATA)) {
    yield call(getCityInfo);
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* cityData() {
  // Fork watcher so we can continue execution
  const watcher = yield fork(getReposWatcher);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  cityData,
];
