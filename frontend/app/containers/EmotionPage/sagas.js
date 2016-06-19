/**
 * Gets the repositories of the user from Github
 */

import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE, push } from 'react-router-redux';
import { LOAD_MOOD_DATA } from 'containers/App/constants';
import { moodDataLoaded, moodDataLoadingError } from 'containers/App/actions';

import request from 'utils/request';
import { selectCity } from 'containers/HomePage/selectors';
import { selectCityData } from 'containers/App/selectors';
import { selectEmotions } from 'containers/EmotionPage/selectors';

/**
 * Github repos request/response handler
 */
export function* getMoodData() {
  // Select username from store
  // console.log('fewafew');

  // const city = yield select(selectCity());
  const cityData = yield select(selectCityData());
  let emotions = yield select(selectEmotions());
  if (emotions) {
    emotions = emotions.toJS();
  }

  const requestURL = 'http://ec2-52-87-240-146.compute-1.amazonaws.com:23001/returnIter';

  const formData = new FormData();
  const emotionsWanted = [];
  emotions.map((emotion) => {
    if (emotion.toggled) {
      return emotionsWanted.push(emotion.name);
    }
  });

  console.log(emotionsWanted);

  formData.append('city', cityData.initialData.city);
  formData.append('selected_moods', emotionsWanted);
  formData.append('current_time', new Date().getTime());

  // Call our request helper (see 'utils/request')
  const emotionData = yield call(request, requestURL,
    {
      method: 'post',
      body: formData,
    }
  );

  if (!emotionData.err) {
    console.log('here');
    yield put(moodDataLoaded(emotionData.data));
  } else {
    yield put(moodDataLoadingError(emotionData.err));
  }
}

/**
 * Watches for LOAD_REPOS action and calls handler
 */
export function* getMoodDataWatcher() {
  while (yield take(LOAD_MOOD_DATA)) {
    yield call(getMoodData);
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* moodData() {
  // Fork watcher so we can continue execution
  const watcher = yield fork(getMoodDataWatcher);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  // yield cancel(watcher);
}

// Bootstrap sagas
export default [
  moodData,
];
