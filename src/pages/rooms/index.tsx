import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Helmet } from 'react-helmet';

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
      <Helmet>
        <title>Huset Café & Motell - Overnatting i Hemnes</title>
        <meta
          name="description"
          content="Huset Café & Motell har 8 flotte rom til utleie for en god pris. Frokost inkludert. Vi ligger rett ved E6 i Hemnes kommune. Perfekt for deg som kjører gjennom Helgeland."
        />
      </Helmet>
      <HeroComponent />
      <main ref={ref}>
        <RoomBooking />
        <RoomsContainer />
      </main>
    </div>
  );
};

export default Rooms;
