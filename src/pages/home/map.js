import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

const mapStyles = {
  margin: '0 auto',
  width: '90%',
  height: '90vh',
};

export class MapContainer extends Component {
  render() {
    return (
      <Map
        google={this.props.google}
        zoom={14}
        style={mapStyles}
        initialCenter={{
          lat: 66.080837,
          lng: 13.825746,
        }}
      />
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAWIvpkNc_f8zWp3YqreiTDxloyEe_jWmA',
})(MapContainer);
