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
          <Link onClick={() => setOpenSidebar(false)} to="/">
            <Logo color="#081214" />
          </Link>
        </figure>
        <div className="sidebar__content">
          <nav className="navigation">
            <div className="navigation__item">
              <NavLink
                exact={true}
                onClick={() => setOpenSidebar(false)}
                to="/"
                activeClassName="navigation__item--active"
              >
                <svg
                  id="Layer_2"
                  data-name="Layer 2"
                  xmlns="http://www.w3.org/2000/svg"
                  width="35.396"
                  height="24.454"
                  viewBox="0 0 35.396 24.454"
                >
                  <g id="Layer_1" data-name="Layer 1" transform="translate(0)">
                    <path
                      id="Path_17"
                      data-name="Path 17"
                      d="M137.57,23.184V9.541l-13.155-7-13.151,7V23.184H109.05v-15L124.415,0l15.369,8.182v15Z"
                      transform="translate(-106.7)"
                    />
                    <path
                      id="Path_18"
                      data-name="Path 18"
                      d="M35.4,4.86h0Z"
                      transform="translate(0 19.594)"
                      fill="#fff"
                    />
                  </g>
                </svg>

                {t('nav:home')}
              </NavLink>
            </div>
            <div className="navigation__item">
              <NavLink
                onClick={() => setOpenSidebar(false)}
                to="/overnatting"
                activeClassName="navigation__item--active"
              >
                <svg
                  id="Layer_1"
                  data-name="Layer 1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 73 82.5"
                >
                  <rect
                    style={{
                      fill: 'none',
                      strokeMiterlimit: 10,
                      strokeWidth: '3px',
                    }}
                    x="1.56"
                    y="1.5"
                  />{' '}
                  <rect x="41" y="9.5" width="23" height="18" />
                  <rect x="9" y="9.5" width="23" height="18" />
                  <rect y="31.5" width="73" height="51" />
                </svg>
                {t('nav:rooms')}
              </NavLink>
            </div>
            <div className="navigation__item">
              <NavLink
                onClick={() => setOpenSidebar(false)}
                to="/meny"
                activeClassName="navigation__item--active"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 103.58 74.32"
                >
                  <title>dish</title>
                  <g id="Layer_2" data-name="Layer 2">
                    <g id="Layer_2-2" data-name="Layer 2">
                      <ellipse
                        style={{
                          fill: 'none',
                          strokeWidth: '3px',
                          strokeMiterlimit: 10,
                        }}
                        cx="49.82"
                        cy="37.16"
                        rx="35.21"
                        ry="35.66"
                      />
                      <ellipse
                        style={{
                          fill: 'none',
                          strokeWidth: '3px',
                          strokeMiterlimit: 10,
                        }}
                        cx="49.82"
                        cy="37.16"
                        rx="23.55"
                        ry="23.84"
                      />
                      <g id="layer1">
                        <path
                          id="path18114"
                          style={{
                            fill: 'none',
                            strokeWidth: '3px',
                            strokeLinecap: 'round',
                          }}
                          d="M9.84,7.09V23.61"
                        />
                        <path
                          id="path18120"
                          style={{
                            fill: 'none',
                            strokeWidth: '3px',
                          }}
                          d="M5.67,34.33V50.89"
                        />
                        <path
                          id="path18122"
                          style={{
                            fill: 'none',
                            strokeWidth: '3px',
                            strokeLinecap: 'round',
                          }}
                          d="M5.67,7V23.51"
                        />
                        <path
                          id="path18124"
                          style={{
                            fill: 'none',
                            strokeWidth: '3px',
                            strokeLinecap: 'round',
                          }}
                          d="M1.5,7.09V23.61"
                        />
                      </g>
                      <rect
                        style={{
                          fill: 'none',
                          strokeWidth: '3px',
                          strokeLinecap: 'round',
                        }}
                        x="1.5"
                        y="24.21"
                        width="8.34"
                        height="9.21"
                      />
                      <rect x="3.59" y="45.26" width="4.17" height="27.56" />
                      <path d="M102.4,5.81a2.09,2.09,0,0,0-2.16.33c-.48.4-11.6,10.29-11.6,35.6a2,2,0,0,0,1.93,2h9V69.58a2,2,0,0,0,4,0v-62A1.89,1.89,0,0,0,102.4,5.81Zm-2.81,34.1H92.66c.27-13.5,4-22,6.93-26.62Z" />
                      <rect x="99.59" y="42.18" width="4" height="30.64" />
                    </g>
                  </g>
                </svg>
                {t('nav:food')}
              </NavLink>
            </div>
            <div className="navigation__item">
              <NavLink
                onClick={() => setOpenSidebar(false)}
                to="/arrangementer"
                activeClassName="navigation__item--active"
              >
                <svg
                  id="Layer_2"
                  data-name="Layer 2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 120.18 113.45"
                >
                  <title>events</title>
                  <rect
                    style={{
                      fill: 'none',
                      strokeMiterlimit: 10,
                      strokeWidth: '3px',
                    }}
                    x="25.96"
                    y="20.82"
                    width="79.25"
                    height="80.55"
                  />
                  <rect
                    style={{
                      fill: 'none',
                      strokeMiterlimit: 10,
                      strokeWidth: '3px',
                    }}
                    x="36.23"
                    y="49.68"
                    width="12.76"
                    height="11.26"
                  />
                  <rect
                    style={{
                      fill: 'none',
                      strokeMiterlimit: 10,
                      strokeWidth: '3px',
                    }}
                    x="58.94"
                    y="49.68"
                    width="12.76"
                    height="11.26"
                  />
                  <rect
                    style={{
                      fill: 'none',
                      strokeMiterlimit: 10,
                      strokeWidth: '3px',
                    }}
                    x="58.94"
                    y="71.91"
                    width="12.76"
                    height="11.26"
                  />
                  <rect
                    style={{
                      fill: 'none',
                      strokeMiterlimit: 10,
                      strokeWidth: '3px',
                    }}
                    x="35.93"
                    y="71.91"
                    width="12.76"
                    height="11.26"
                  />
                  <rect
                    style={{
                      fill: 'none',
                      strokeMiterlimit: 10,
                      strokeWidth: '3px',
                    }}
                    x="81.07"
                    y="71.91"
                    width="12.76"
                    height="11.26"
                  />
                  <rect
                    style={{
                      fill: 'none',
                      strokeMiterlimit: 10,
                      strokeWidth: '3px',
                    }}
                    x="81.07"
                    y="49.68"
                    width="12.76"
                    height="11.26"
                  />
                  <rect
                    style={{
                      fill: 'none',
                      strokeMiterlimit: 10,
                      strokeWidth: '3px',
                    }}
                    x="37.25"
                    y="12.71"
                    width="10.39"
                    height="10.1"
                  />
                  <rect
                    style={{
                      fill: 'none',
                      strokeMiterlimit: 10,
                      strokeWidth: '3px',
                    }}
                    x="60.13"
                    y="12.68"
                    width="10.39"
                    height="10.1"
                  />
                  <rect
                    style={{
                      fill: 'none',
                      strokeMiterlimit: 10,
                      strokeWidth: '3px',
                    }}
                    x="83.14"
                    y="12.68"
                    width="10.39"
                    height="10.1"
                  />
                  <circle
                    style={{
                      strokeMiterlimit: 10,
                      strokeWidth: '3px',
                    }}
                    cx="100.91"
                    cy="94.19"
                    r="17.77"
                  />
                  <line
                    style={{
                      fill: 'none',
                      strokeMiterlimit: 10,
                      strokeWidth: '3px',
                    }}
                    x1="100.91"
                    y1="94.19"
                    x2="96.69"
                    y2="79.29"
                  />
                  <line
                    style={{
                      fill: 'none',
                      strokeMiterlimit: 10,
                      strokeWidth: '3px',
                      strokeLinecap: 'round',
                    }}
                    x1="1.5"
                    y1="8.66"
                    x2="15.21"
                    y2="23.35"
                  />
                  <line
                    style={{
                      fill: 'none',
                      strokeMiterlimit: 10,
                      strokeWidth: '3px',
                      strokeLinecap: 'round',
                    }}
                    x1="28.92"
                    y1="8.66"
                    x2="15.21"
                    y2="23.35"
                  />
                  <line
                    style={{
                      fill: 'none',
                      strokeMiterlimit: 10,
                      strokeWidth: '3px',
                    }}
                    x1="1.5"
                    y1="8.66"
                    x2="28.92"
                    y2="8.66"
                  />
                  <line
                    style={{
                      fill: 'none',
                      strokeMiterlimit: 10,
                      strokeWidth: '3px',
                    }}
                    x1="15.21"
                    y1="23.35"
                    x2="15.21"
                    y2="38.03"
                  />
                  <line
                    style={{
                      fill: 'none',
                      strokeMiterlimit: 10,
                      strokeWidth: '3px',
                      strokeLinecap: 'round',
                    }}
                    x1="21.09"
                    y1="38.03"
                    x2="9.33"
                    y2="38.03"
                  />
                  <line
                    style={{
                      fill: 'none',
                      strokeMiterlimit: 10,
                      strokeWidth: '3px',
                    }}
                    x1="5.5"
                    y1="0.93"
                    x2="16.19"
                    y2="14.53"
                  />
                </svg>
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
