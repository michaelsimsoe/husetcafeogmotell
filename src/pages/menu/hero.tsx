import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import family_dinner from './assets/hero.jpg';

export const HeroComponent: React.FunctionComponent = () => {
  const { t } = useTranslation(['translation', 'home']);
  return (
    <section className="hero menu-hero">
      <div className="hero-img-large"></div>
      <div className="hero-img-mobile">
        <div className="hero-img__overlay"></div>
        <div className="hero__header">
          <h3>Huset Café & Motell</h3>
          <h1>Restaurant</h1>
          <h4>Maten vi serverer</h4>
        </div>
        <img src={family_dinner} alt="family eating dinner" />
      </div>
      <section className="hero-contact">
        <div className="hero-contact__text">
          <p>
            At Huset Café & Motell we serve a verity of dishes where the
            traditional Norwegian Cooking is our speciality.
          </p>
          <p>We also take pride in our splendid Pizza.</p>
        </div>
        <div className="hero-contact__location-hint">
          <p>Se menyen</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="165.96"
            height="39.96"
            viewBox="0 0 165.96 39.96"
          >
            <g id="Caret" transform="translate(-89.52 -587.52)">
              <line
                id="Line_2"
                data-name="Line 2"
                x2="81"
                y2="36"
                transform="translate(91.5 589.5)"
                fill="none"
                stroke="#081214"
                strokeLinecap="round"
                strokeWidth="3"
              />
              <line
                id="Line_3"
                data-name="Line 3"
                x1="81"
                y2="36"
                transform="translate(172.5 589.5)"
                fill="none"
                stroke="#081214"
                strokeLinecap="round"
                strokeWidth="3"
              />
            </g>
          </svg>
        </div>
      </section>
    </section>
  );
};
