/*
 *
 * EmotionPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import selectEmotionPage from './selectors';
import selectEmotions from './selectors';
import { push } from 'react-router-redux';
import { selectCityData } from '../App/selectors';

import { loadMoodData } from '../App/actions';

import { createStructuredSelector } from 'reselect';

import { selectEmotion } from './actions';
import EmotionButton from 'components/EmotionButton';
import Button from 'components/Button';
import styles from './styles.css';
import newYorkImg from './city_newyork.jpg';

export class EmotionPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    // if (!this.props.cityData.initialData) {
    //   // this.props.dispatch(push('emotions'));
    // }
  }
  render() {
    const emotions = this.props.emotions.emotions;

    const emotionBtns = emotions.map((emotion) => {
      let emotionBtn = (
        <EmotionButton onClick={() => { this.props.onToggleEmotion(emotion.id); }} key={emotion.id}>{emotion.name}</EmotionButton>
      );
      if (emotion.toggled) {
        emotionBtn = (
          <EmotionButton selected onClick={() => { this.props.onToggleEmotion(emotion.id); }} key={emotion.id}>{emotion.name}</EmotionButton>
        );
      }
      return emotionBtn;
    });

    // const emotionButtons = emotions.map
    return (
      <div
        style={{
          backgroundImage:
          `linear-gradient(
          rgba(0, 0, 0, 0.2),
          rgba(0, 0, 0, 0.2)), url(${newYorkImg})`,
        }}
        className={styles.emotionPage}
      >
        <h1>What are you in the mood for?</h1>
          {emotionBtns}
        <Button onClick={(evt) => { this.props.onSubmitForm(evt, this.props.emotions); }}>Submit</Button>
      </div>
    );
  }
}

EmotionPage.propTypes = {
  onToggleEmotion: React.PropTypes.func,
  emotions: React.PropTypes.object,
  onSubmitForm: React.PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  selectEmotionPage: selectEmotionPage(),
  emotions: selectEmotions(),
  cityData: selectCityData(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onSubmitForm: (evt, emotions) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadMoodData(emotions));
      setTimeout(() => {
        dispatch(push('map'));
      }, 1000);
    },
    onToggleEmotion: (emotion) => dispatch(selectEmotion(emotion)),
    // onClickButton: (emotionBtn) => dispatch(selectEmotion(emotionBtn)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EmotionPage);
