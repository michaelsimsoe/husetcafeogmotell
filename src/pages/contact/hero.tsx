import React from 'react';
// import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const svgStyle = {
  fill: '#fff',
  height: '27px',
  marginLeft: '11px',
  paddingTop: '2px',
};

export const HeroComponent: React.FunctionComponent = () => {
  const { t } = useTranslation(['translation', 'contact']);
  return (
    <section className="hero contact-hero">
      <div className="hero-img-large">
        <header className="hero__header">
          <h1>{t('contact:landing-heading')}</h1>
        </header>
        <div className="hero-contact-text">
          <p>{t('contact:landing-text1')}</p>
          <p>{t('contact:landing-text2')}</p>
          <p>{t('contact:landing-text3')}</p>
          <p>{t('contact:landing-text4')}</p>
        </div>
      </div>
      <div className="hero-img-mobile">
        <div className="hero__header">
          <h1>{t('contact:landing-heading')}</h1>
        </div>
      </div>
      <section className="hero-contact">
        <div className="hero-contact__text">
          <p>{t('contact:landing-text1')}</p>
          <p>{t('contact:landing-text2')}</p>
          <p>{t('contact:landing-text3')}</p>
        </div>
        <div className="hero-contact__buttons">
          <a className="button" href="tel:+4740317353">
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
          <small>403 17 353</small>
        </div>
      </section>
    </section>
  );
};
