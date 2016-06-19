import React, { PropTypes, Component } from 'react';
// import shouldPureComponentUpdate from 'react-pure-render/function';

// import GoogleMap from 'google-map-react';
import { GoogleMapLoader, GoogleMap, Marker, InfoWindow } from "react-google-maps";

// import MyGreatPlace from './my_great_place.jsx';

export default class SimpleMapPage extends Component {
  static defaultProps = {
    center: {lat: 59.938043, lng: 30.337157},
    zoom: 11,
    greatPlaceCoords: {lat: 59.724465, lng: 30.080121}
  };

  // shouldComponentUpdate = shouldPureComponentUpdate;

  constructor() {
    super();
  }

  //Toggle to 'true' to show InfoWindow and re-renders component
  handleMarkerClick(marker) {
    marker.showInfo = true;
    // this.setState(this.state);
  }


  render() {
    console.log(this.props);
    return (
      <section style={{height: "100%"}}>
        <GoogleMapLoader
          containerElement={
            <div
              {...this.props.containerElementProps}
              style={{
                height: "100%",
              }}
            />
          }
          googleMapElement={
            <GoogleMap
              ref={(map) => console.log(map)}
              defaultZoom={13}
              defaultCenter={{ lat: this.props.lat, lng: this.props.lng }}
              onClick={this.props.onMapClick}
            >
              {this.props.markers.map((marker, index) => {
                return (
                  <Marker
                    {...marker}
                    onClick={() => this.props.onSelectMarker(marker)}
                    key={index}
                    onRightclick={() => this.props.onMarkerRightclick(index)} />
                );
              })}
            </GoogleMap>
          }
        />
      </section>
    );
  }
}
