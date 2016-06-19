/*
 *
 * MapResults
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { selectMapResults, selectCurrentMarker } from './selectors';

import { selectMoodData } from '../App/selectors';
import { selectCity } from '../HomePage/selectors';
import { selectMarker } from './actions';

import { createStructuredSelector } from 'reselect';
import styles from './styles.css';
import SimpleMap from 'containers/SimpleMap';

export class MapResults extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { moodData, city, marker } = this.props;
    let lat = 53;
    let lng = 42;

    console.info('selected marker', marker);
    const markers = [];

    let bizInfo = (
      <div>
        <p className={styles.bigger}>No business information.</p>
      </div>
    );

    let bizPhoto = (
      <div>
        No photo.
      </div>
    );

    if (marker) {
      bizInfo = (
        <div>
          <p className={styles.bigger}>
            {marker.name}
          </p>
            {marker.type !== 'restaurant' &&
              <p>
                {marker.price}
              </p>
            }
          {marker.rating_img_url &&
            <img src={marker.rating_img_url} />
          }
        </div>
      );
      const divStyle = {
        backgroundImage: 'url(' + marker.image + ')',
      };
      bizPhoto = (
        <div className={styles.bizPhoto}
          style={divStyle}>
        </div>
      );
    }
    if (moodData.initialData) {
      Object.keys(moodData.initialData).map((key) => {
        return markers.push(
          {
            ...moodData.initialData[key],
            showInfo: true,
            position: {
              lat: moodData.initialData[key].latlng[0],
              lng: moodData.initialData[key].latlng[1],
            },
          }
        );
      });
    }

    if (city.location) {
      lat = city.location.lat;
      lng = city.location.lng;
    }

    return (
      <div className={styles.mapResults}>
        <div className={styles.mapContainer}>
          <SimpleMap lat={lat} lng={lng} onSelectMarker={this.props.onSelectMarker} markers={markers} />
        </div>
        <div className={styles.bottomContainer}>
          <div className={styles.left}>
            {bizInfo}
          </div>
          <div className={styles.right}>
              {bizPhoto}
          </div>

        </div>
      </div>
    );
  }
}

MapResults.propTypes = {
  moodData: React.PropTypes.object,
  city: React.PropTypes.object,
  marker: React.PropTypes.object,
  onSelectMarker: React.PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  // selectMapResults: selectMapResults(),
  moodData: selectMoodData(),
  city: selectCity(),
  marker: selectCurrentMarker(),
});

function mapDispatchToProps(dispatch) {
  return {
    onSelectMarker: (marker) => dispatch(selectMarker(marker)),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapResults);
