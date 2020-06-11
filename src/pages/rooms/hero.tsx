import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Image, Transformation } from 'cloudinary-react';

const svgStyle = {
  fill: '#081214',
  height: '14px',
  marginLeft: '6px',
  paddingTop: '2px',
};

export const HeroComponent: React.FunctionComponent = () => {
  const { t } = useTranslation(['translation', 'rooms']);
  return (
    <section className="hero rooms-hero">
      <div className="hero-img-large">
        <div className="hero-img-large__content">
          <div className="hero__header">
            <h3>Huset Café & Motell</h3>
            <h1>{t('rooms:heading')}</h1>
            <h4>{t('rooms:sub-heading')}</h4>
          </div>
          <div className="hero-img-large__contact">
            <Link to="/kontakt" className="button button-padded">
              Kontakt oss
            </Link>
            <small>Så prater vi om overnatting</small>
          </div>
          <div className="hero-img-large__book">
            <p>Eller book online</p>
            <div className="booking-container">
              <a
                href="https://www.booking.com/hotel/no/huset-cafe-amp-motell-as.en-gb.html"
                className="button"
              >
                {t('rooms:book-btn')}
              </a>
            </div>
          </div>
        </div>
        <div className="hero-img-large__image">
          <div className="hero-img__overlay"></div>
          <Image
            cloudName="huset-cafe-og-motell"
            publicId="rooms/rom_en_x0nqo8"
            crop="scale"
          >
            <Transformation fetchFormat="auto" crop="scale" />
          </Image>
        </div>
      </div>
      <div className="hero-img-mobile">
        <div className="hero-img__overlay"></div>
        <div className="hero__header">
          <h3>Huset Café & Motell</h3>
          <h1>{t('rooms:heading')}</h1>
          <h4>{t('rooms:sub-heading')}</h4>
        </div>
        <Image
          cloudName="huset-cafe-og-motell"
          publicId="rooms/rom_bredt_rjpinu"
          crop="scale"
        >
          <Transformation fetchFormat="auto" crop="scale" />
        </Image>
      </div>
      <section className="hero-contact">
        <div className="hero-contact__text">
          <h2 className="section-heading">{t('rooms:contact-heading')}</h2>
          <p>{t('rooms:contact-text')}</p>
        </div>
        <div className="hero-contact__buttons">
          <Link className="button" to="/kontakt">
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
          <p>{t('rooms:book-online')}</p>
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
