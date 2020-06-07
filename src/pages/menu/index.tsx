import React from 'react';
import { HeroComponent } from './hero';
import { MenuContainer } from './menuContainer';

import menu from '../../data/menu.json';

export const Menu: React.FunctionComponent = () => {
  return (
    <div className="menu">
      <HeroComponent />
      <section className="menu-section">
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
