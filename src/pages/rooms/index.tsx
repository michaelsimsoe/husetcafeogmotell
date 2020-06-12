import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { HeroComponent } from './hero';
import { RoomBooking } from './booking';
import { RoomsContainer } from './rooms';
interface RoomProps {
  sidebarOpen: (boolean) => void;
}
const Rooms: React.FunctionComponent<RoomProps> = ({ sidebarOpen }) => {
  const [ref, inView] = useInView({ rootMargin: '-300px' });

  useEffect(() => {
    sidebarOpen(inView);
  }, [sidebarOpen, inView]);

  return (
    <div className="rooms">
      <HeroComponent />
      <main ref={ref}>
        <RoomBooking />
        <RoomsContainer />
      </main>
    </div>
  );
};

export default Rooms;
