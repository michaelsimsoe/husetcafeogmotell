import React, { lazy } from 'react';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import { NavLink, Link } from 'react-router-dom';

import { Loader } from '../loader';
import FacebookFeed from './facebookFeed';
import facebookIcon from './facebook.svg';

// const FacebookFeed = lazy(() => import('./facebookFeed'));
const MapLocation = lazy(() => import('../map/mapContainer'));

export const Footer: React.FunctionComponent = () => {
  const { t } = useTranslation(['translation', 'footer', 'rooms']);

  const [socialRef, socialInView] = useInView({
    triggerOnce: true,
    rootMargin: '-100px',
  });
  return (
    <>
      <section ref={socialRef} className="social-section">
        {socialInView ? (
          <div className="desktop-map">
            <MapLocation />
          </div>
        ) : (
          <Loader height="50vh" />
        )}
        <div className="facebook-feed-container">
          <FacebookFeed />
        </div>
      </section>
      <footer className="main-footer wrapper">
        <div className="main-footer__container">
          <section className="main-footer__primary">
            <nav className="main-footer__site-map">
              <ul>
                <li>
                  <NavLink
                    exact={true}
                    to="/"
                    activeClassName="footer-nav--active"
                  >
                    {t('footer:home')}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    exact={true}
                    to="/overnatting"
                    activeClassName="footer-nav--active"
                  >
                    {t('footer:rooms')}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    exact={true}
                    to="/meny"
                    activeClassName="footer-nav--active"
                  >
                    {t('footer:food')}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    exact={true}
                    to="/arrangementer"
                    activeClassName="footer-nav--active"
                  >
                    {t('footer:events')}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    exact={true}
                    to="/kontakt"
                    activeClassName="footer-nav--active"
                  >
                    {t('footer:contact')}
                  </NavLink>
                </li>
              </ul>
            </nav>
            <div className="main-footer__local">
              <ul>
                <li>
                  <a href="https://visitokstindan.com/">
                    {t('rooms:oks-link')}
                  </a>
                </li>
                <li>
                  <a href="https://visithelgeland.com/">visithelgeland.com</a>
                </li>
              </ul>
            </div>
          </section>
          <section className="main-footer__secondary">
            <p>
              Vi kommuniserer mye gjennom facebooksiden vår. Kom innom og si
              hei.
            </p>
            <a
              href="https://www.facebook.com/Husetcafe"
              className="social-icon"
            >
              <img src={facebookIcon} alt="" />
            </a>
          </section>
        </div>
        <footer className="main-footer__footer">
          <p>{t('footer:footer-1')}</p>
          <p>
            {t('footer:footer-2')} <a href="https://simsø.no">Simsø Web</a>
          </p>
          <p>
            {t('footer:footer-3')}{' '}
            <Link to="anerkjennelse">{t('footer:footer-4')}</Link>
          </p>
        </footer>
      </footer>
    </>
  );
};
