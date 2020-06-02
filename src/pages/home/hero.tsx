import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { HeroParallaxImage } from './hero-img';
import { HeroParallaxImageMobile } from './hero-img-mob';

const svgStyle = {
  fill: '#fff',
  height: '14px',
  marginLeft: '6px',
  paddingTop: '2px',
};

export const HeroComponent: React.FunctionComponent = () => {
  const { t } = useTranslation(['translation', 'home']);
  return (
    <section className="hero">
      <div className="hero-img-large">
        <HeroParallaxImage />
      </div>
      <div className="hero-img-mobile">
        <HeroParallaxImageMobile />
      </div>
      <section className="hero-contact">
        <div className="hero-contact__text">
          <h2 className="section-heading">{t('home:landing-heading')}</h2>
          <p>{t('home:landing-text')}</p>
        </div>
        <div className="hero-contact__buttons">
          <Link className="button" to="/">
            {t('translation:buttons.contact')}
          </Link>
          <a className="button" href="tel:+4775197200">
            {t('translation:buttons.call')}
            <svg
              version="1.1"
              x="0px"
              y="0px"
              viewBox="0 0 513.64 513.64"
              style={svgStyle}
            >
              <g>
                <g>
                  <path
                    d="M499.66,376.96l-71.68-71.68c-25.6-25.6-69.12-15.359-79.36,17.92c-7.68,23.041-33.28,35.841-56.32,30.72
			c-51.2-12.8-120.32-79.36-133.12-133.12c-7.68-23.041,7.68-48.641,30.72-56.32c33.28-10.24,43.52-53.76,17.92-79.36l-71.68-71.68
			c-20.48-17.92-51.2-17.92-69.12,0l-48.64,48.64c-48.64,51.2,5.12,186.88,125.44,307.2c120.32,120.32,256,176.641,307.2,125.44
			l48.64-48.64C517.581,425.6,517.581,394.88,499.66,376.96z"
                  />
                </g>
              </g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
            </svg>
          </a>
        </div>
        <div className="hero-contact__location-hint">
          <p>{t('home:location-hint')}</p>
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
                stroke="#fff"
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
                stroke="#fff"
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
