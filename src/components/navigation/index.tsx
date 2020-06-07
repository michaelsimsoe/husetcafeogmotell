import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';

import { Logo } from '../logo';

interface NavigationProps {
  open: boolean;
}

export const Navigation: React.FunctionComponent<NavigationProps> = ({
  open,
}) => {
  const { t } = useTranslation(['translation', 'nav']);
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const closeAndScrollToTop = () => {
    setOpenSidebar(false);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  const sideBarClass =
    open || openSidebar ? 'main-sidebar main-sidebar--open' : 'main-sidebar';

  const menuBtnClassName =
    open || openSidebar ? 'main-menuBtn main-menuBtn--open' : 'main-menuBtn';

  return (
    <>
      <div
        onClick={() => setOpenSidebar(!openSidebar)}
        className={menuBtnClassName}
        id="menu"
        tabIndex={0}
      >
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <h4>{t('nav:menu')}</h4>
      </div>
      <aside className={sideBarClass}>
        <figure className="sidebar__logo">
          <Link onClick={() => closeAndScrollToTop()} to="/">
            <Logo color="#081214" />
          </Link>
        </figure>
        <div className="sidebar__content">
          <nav className="navigation">
            <div className="navigation__item">
              <NavLink onClick={() => setOpenSidebar(false)} to="/">
                {t('nav:home')}
              </NavLink>
            </div>
            <div className="navigation__item">
              <NavLink onClick={() => setOpenSidebar(false)} to="/overnatting">
                {t('nav:rooms')}
              </NavLink>
            </div>
            <div className="navigation__item">
              <NavLink onClick={() => setOpenSidebar(false)} to="/meny">
                {t('nav:food')}
              </NavLink>
            </div>
            <div className="navigation__item">
              <NavLink
                onClick={() => setOpenSidebar(false)}
                to="/arrangementer"
              >
                {t('nav:events')}
              </NavLink>
            </div>
          </nav>
          <LanguageSelect />
        </div>
      </aside>
    </>
  );
};

const LanguageSelect: React.FunctionComponent = () => {
  const { t, i18n } = useTranslation(['translation', 'nav']);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <div className="sidebar__lang">
      <div className="sidebar__lang-btn" onClick={() => changeLanguage('no')}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="89.655"
          height="47.3"
          viewBox="0 0 89.655 47.3"
        >
          <defs />
          <defs>
            <clipPath id="a">
              <path
                fill="none"
                d="M0 0h89.655v47.3H0z"
                data-name="Rectangle 24"
              />
            </clipPath>
          </defs>
          <g clipPath="url(#a)" data-name="Group 2">
            <path
              fill="#c1121d"
              d="M89.654 47.231H.009V0h89.645v47.231z"
              data-name="Path 62"
            />
            <path
              fill="#fff"
              d="M27.588 17.747L27.576-.005H16.49l.01 17.715-16.5.036v11.856l16.509.007.011 17.691h11.065V29.6h62.014V17.743H27.585z"
              data-name="Path 63"
            />
            <path
              fill="#192c66"
              d="M24.644 20.901V-.005h-5.267v20.906H.037v5.643h19.34v20.684h5.268V26.544h64.8v-5.643z"
              data-name="Path 64"
            />
          </g>
        </svg>
        <span className="sidebar__lang-btn-text">{t('translation:no')}</span>
      </div>
      <div className="sidebar__lang-btn" onClick={() => changeLanguage('en')}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="89.417"
          height="47.18"
          viewBox="0 0 89.417 47.18"
        >
          <defs />
          <path
            fill="#fff"
            d="M0 .004h89.394v47.099H0z"
            data-name="Rectangle 23"
          />
          <path
            fill="#ce1124"
            d="M89.401 18.847H50.039V.007H39.294v18.84H.037v9.42h39.257v18.836h10.745V28.267h39.362z"
            data-name="Path 49"
          />
          <path
            fill="#00247d"
            d="M.001 5.489v10.255h19.5z"
            data-name="Path 50"
          />
          <path
            fill="#00247d"
            d="M10.758.002l-.286.013 25.282 13.367V.002z"
            data-name="Path 51"
          />
          <path
            fill="#ce1124"
            d="M30.006 15.678L.001.004v3.694l22.855 11.98z"
            data-name="Path 52"
          />
          <path
            fill="#ce1124"
            d="M59.412 31.425l30.006 15.674v-3.694l-22.855-11.98z"
            data-name="Path 53"
          />
          <path
            fill="#00247d"
            d="M.001 41.694V31.439h19.5z"
            data-name="Path 54"
          />
          <path
            fill="#00247d"
            d="M10.758 47.18l-.286-.013L35.754 33.8v13.38z"
            data-name="Path 55"
          />
          <path
            fill="#ce1124"
            d="M29.853 31.424L.021 47.091l6.977.007 28.786-15.037v-.637z"
            data-name="Path 56"
          />
          <path
            fill="#00247d"
            d="M89.417 5.486v10.255h-19.5z"
            data-name="Path 57"
          />
          <path
            fill="#00247d"
            d="M78.664 0l.286.013L53.664 13.38V0z"
            data-name="Path 58"
          />
          <path
            fill="#ce1124"
            d="M89.389.022h-6.711L53.69 15.165v.531h6.13z"
            data-name="Path 59"
          />
          <path
            fill="#00247d"
            d="M89.417 41.69V31.435h-19.5z"
            data-name="Path 60"
          />
          <path
            fill="#00247d"
            d="M78.664 47.176l.286-.013-25.286-13.367v13.38z"
            data-name="Path 61"
          />
        </svg>
        <span className="sidebar__lang-btn-text">{t('translation:en')}</span>
      </div>
    </div>
  );
};
