import React, { PropTypes, Component } from 'react';
// import shouldPureComponentUpdate from 'react-pure-render/function';

import GoogleMap from 'google-map-react';
// import MyGreatPlace from './my_great_place.jsx';

export default class SimpleMapPage extends Component {
  static defaultProps = {
    center: {lat: 59.938043, lng: 30.337157},
    zoom: 11,
    greatPlaceCoords: {lat: 59.724465, lng: 30.080121}
  };

  // shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props);
    return (
        <GoogleMap
          center={{ lat: this.props.lat, lng: this.props.lng }}
          zoom={14}
        />
    );
  }
}
