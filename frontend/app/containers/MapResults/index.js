/*
 *
 * MapResults
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { selectMapResults } from './selectors';

import { selectMoodData } from '../App/selectors';
import { selectCity } from '../HomePage/selectors';

import { createStructuredSelector } from 'reselect';
import styles from './styles.css';
import SimpleMap from 'containers/SimpleMap';

export class MapResults extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { moodData, city } = this.props;
    let lat = 53;
    let lng = 42;

    if (city.location) {
      lat = city.location.lat;
      lng = city.location.lng;
    }

    return (
      <div className={styles.mapResults}>
        <div className={styles.mapContainer}>
          <SimpleMap lat={lat} lng={lng} />
        </div>
        <div className={styles.bottomContainer}>
          <div className={styles.left}>
            Name of the activity / biz
          </div>
          <div className={styles.right}>
            {this.props.moodData.initialData &&
              (
                <div>
                  test
                </div>
              )
            }
          </div>

        </div>
      </div>
    );
  }
}

MapResults.propTypes = {
  moodData: React.PropTypes.object,
  city: React.PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  // selectMapResults: selectMapResults(),
  moodData: selectMoodData(),
  city: selectCity(),

});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapResults);
