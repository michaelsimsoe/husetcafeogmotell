import React from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

import mapStyle from './mapStyles';

// const containerStyles = {
//   position: 'relative',
// };

const MapContainer = (props) => {
  const _mapLoaded = (mapProps, map) => {
    map.setOptions({
      styles: mapStyle,
    });
  };
  return (
    <Map
      google={props.google}
      style={{ position: 'relative', height: '100vh' }}
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
