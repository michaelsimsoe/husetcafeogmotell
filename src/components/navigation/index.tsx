import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { Logo } from '../logo';

interface NavigationProps {
  open: boolean;
}

export const Navigation: React.FunctionComponent<NavigationProps> = ({
  open,
}) => {
  const { t, i18n } = useTranslation(['translation', 'nav']);
  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };
  const [openSidebar, setOpenSidebar] = useState(false);

  const sideBarClass =
    open || openSidebar ? 'main-sidebar main-sidebar--open' : 'main-sidebar';

  const menuBtnClassName =
    open || openSidebar ? 'main-menuBtn main-menuBtn--open' : 'main-menuBtn';
  return (
    <>
      <button
        onClick={() => setOpenSidebar(!openSidebar)}
        className={menuBtnClassName}
        id="menu"
        tabIndex={0}
      >
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <h4>Menu</h4>
      </button>
      <aside className={sideBarClass}>
        <figure className="sidebar__logo">
          <Logo color="#081214" />
        </figure>
        <nav className="sidebar__navigation">
          <div className="navigation__item">
            <NavLink to="/">{t('nav:home')}</NavLink>
          </div>
          <div className="navigation__item">
            <NavLink to="/overnatting">{t('nav:rooms')}</NavLink>
          </div>
          <div className="navigation__item">
            <NavLink to="/meny">{t('nav:food')}</NavLink>
          </div>
          <div className="navigation__item">
            <NavLink to="/arrangementer">{t('nav:events')}</NavLink>
          </div>
        </nav>
        <button
          className="sidebar__lang-btn"
          type="button"
          onClick={() => changeLanguage('no')}
        >
          {t('translation:no')}
        </button>

        <button
          className="sidebar__lang-btn"
          type="button"
          onClick={() => changeLanguage('en')}
        >
          {t('translation:en')}
        </button>
      </aside>
    </>
  );
};
