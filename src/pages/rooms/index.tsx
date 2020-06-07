import React from 'react';
import { HeroComponent } from './hero';
import { RoomBooking } from './booking';
import { RoomsContainer } from './rooms';

export const Rooms: React.FunctionComponent = () => {
  return (
    <div className="rooms">
      <HeroComponent />
      <RoomBooking />
      <RoomsContainer />
    </div>
  );
};
