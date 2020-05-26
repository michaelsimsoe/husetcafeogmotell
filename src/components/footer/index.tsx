import React from 'react';

import { FacebookFeed } from './facebookFeed';
import MapLocation from '../map/mapContainer';

import facebookIcon from './facebook.svg';

export const Footer: React.FunctionComponent = () => {
  return (
    <>
      <section className="social-section">
        <div className="desktop-map">
          <MapLocation className="" />
        </div>
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
