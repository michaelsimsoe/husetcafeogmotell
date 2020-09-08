import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Helmet } from 'react-helmet';

import { HeroComponent } from './hero';
import { MenuContainer } from './menuContainer';

import staticMenu from '../../data/menu.json';

interface MenuProps {
  sidebarOpen: (boolean) => void;
}
const Menu: React.FunctionComponent<MenuProps> = ({ sidebarOpen }) => {
  const [ref, inView] = useInView({ rootMargin: '-300px' });
  const [data, setData] = useState(staticMenu);

  useEffect(() => {
    sidebarOpen(inView);
  }, [sidebarOpen, inView]);

  useEffect(() => {
    fetch('https://admin.husetmotell.no/api/v1/menus')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((menus) => {
        let parsedMenus = menus.map((menu) => {
          return {
            name: {
              no: menu.name,
              en: menu.en_name,
            },
            description: {
              no: menu.description,
              en: menu.en_description,
            },
            placement: menu.placement,
            menuItems: menu.menu_items.map((item) => {
              return {
                name: { no: item.name, en: item.en_name },
                description: { no: item.description, en: item.en_description },
                price: item.price,
                allergenes: {
                  no: item.allergens.map((allergen) => {
                    return allergen.name;
                  }),
                  en: item.allergens.map((allergen) => {
                    return allergen.en_name;
                  }),
                },
                placement: item.placement,
              };
            }),
          };
        });
        setData(parsedMenus.sort((a, b) => a.placement - b.placement));
      })
      .catch((error) => {
        console.error(
          'There has been a problem with your fetch operation:',
          error
        );
      });
  }, []);

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
          {data &&
            data.map((category, index) => {
              return <MenuContainer key={index} menu={category} />;
            })}
        </section>
      </section>
    </div>
  );
};

export default Menu;
