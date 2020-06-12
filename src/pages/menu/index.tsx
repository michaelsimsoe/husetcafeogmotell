import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Helmet } from 'react-helmet';

import { HeroComponent } from './hero';
import { MenuContainer } from './menuContainer';

import menu from '../../data/menu.json';
interface MenuProps {
  sidebarOpen: (boolean) => void;
}
const Menu: React.FunctionComponent<MenuProps> = ({ sidebarOpen }) => {
  const [ref, inView] = useInView({ rootMargin: '-300px' });

  useEffect(() => {
    sidebarOpen(inView);
  }, [sidebarOpen, inView]);

  return (
    <div className="menu">
      <Helmet>
        <title>Huset Café & Motell - Middag i Hemnes</title>
        <meta
          name="description"
          content="Huset Café & Motell har tilbyr en variert meny. Alt fra husmannskost til gatekjøkkenmat. Vi kan også tilby en meget god pizza. Perfekt for deg som kjører gjennom Helgeland."
        />
      </Helmet>
      <HeroComponent />
      <section ref={ref} className="menu-section">
        <h2 className="section-heading">Vår meny</h2>
        <section className="menues">
          {menu.map((category) => {
            return <MenuContainer menu={category} />;
          })}
        </section>
      </section>
    </div>
  );
};

export default Menu;
