import React from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

import mapStyle from './mapStyles';

const MapContainer = (props) => {
  const _mapLoaded = (mapProps, map) => {
    map.setOptions({
      styles: mapStyle,
    });
  };
  const isDesktopWidth = window.matchMedia('(min-width: 600px)').matches;

  return (
    <Map
      google={props.google}
      style={{
        position: 'relative',
        height: isDesktopWidth ? '50vh' : '100vh',
      }}
      containerStyle={{ position: 'relative' }}
      onReady={(mapProps, map) => _mapLoaded(mapProps, map)}
      initialCenter={{
        lat: 66.080837,
        lng: 13.825746,
      }}
      defaultZoom={9}
      gestureHandling={'cooperative'}
    >
      <Marker position={{ lat: 66.080837, lng: 13.825746 }} />
    </Map>
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAWIvpkNc_f8zWp3YqreiTDxloyEe_jWmA',
})(MapContainer);
