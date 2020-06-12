import React, { lazy } from 'react';
import { useInView } from 'react-intersection-observer';

import { Loader } from '../loader';
import facebookIcon from './facebook.svg';

const FacebookFeed = lazy(() => import('./facebookFeed'));
const MapLocation = lazy(() => import('../map/mapContainer'));

export const Footer: React.FunctionComponent = () => {
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
          <section className="main-footer__primary"></section>
          <section className="main-footer__secondary">
            <a
              href="https://www.facebook.com/Husetcafe"
              className="social-icon"
            >
              <img src={facebookIcon} alt="" />
            </a>
          </section>
        </div>
      </footer>
    </>
  );
};
