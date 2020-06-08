import React from 'react';
import { useTranslation } from 'react-i18next';

interface MenuItemProps {
  item: {
    name: { no: string; en: string };
    description: { no: string; en: string };
    price: string;
    allergenes: { no: string[]; en: string[] };
  };
}

export const MenuItem: React.FunctionComponent<MenuItemProps> = ({ item }) => {
  const { t } = useTranslation(['translation', 'menu']);
  return (
    <div className="menu-item">
      <header className="menu-item__header">
        <h4 className="menu-item__name">{item.name.no}</h4>
        <h5 className="menu-item__price">{item.price}-</h5>
      </header>
      <p className="menu-item__description">{item.description.no}</p>
      <p className="menu-item__allergens">
        <span>{t('menu:allergenes')}:</span>{' '}
        {item.allergenes.no.map((a) => `${a} `)}
      </p>
    </div>
  );
};
