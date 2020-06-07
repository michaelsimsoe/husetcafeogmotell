import React from 'react';
import { MenuItem } from './menuItem';

interface MenuContainerProps {
  menu: {
    name: { en: string; no: string };
    description: { no: string; en: string };
    menuItems: {
      name: { no: string; en: string };
      description: { no: string; en: string };
      price: string;
      allergenes: { no: string[]; en: string[] };
    }[];
  };
}

export const MenuContainer: React.FunctionComponent<MenuContainerProps> = ({
  menu,
}) => {
  return (
    <div className="menu-container">
      <h3>{menu.name.no}</h3>
      <p>{menu.description.no}</p>
      {menu.menuItems.map((menuItem) => {
        return <MenuItem item={menuItem} />;
      })}
    </div>
  );
};
