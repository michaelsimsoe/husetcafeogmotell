import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Transformation } from 'cloudinary-react';

export const HeroComponent: React.FunctionComponent = () => {
  const { t } = useTranslation(['translation', 'menu']);
  return (
    <section className="hero menu-hero">
      <div className="hero-img-large">
        <div className="hero-img-large__content">
          <div className="hero__header">
            <h3>Huset Café & Motell</h3>
            <h1>Restaurant</h1>
            <h4>{t('menu:serve')}</h4>
          </div>
          <section className="hero-contact">
            <div className="hero-contact__text">
              <p>{t('menu:serve-text1')}</p>
              <p>{t('menu:serve-text2')}</p>
            </div>
            <div className="hero-contact__location-hint">
              <p>{t('menu:see')}</p>
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
        </div>
        <div className="hero-img-large__image">
          <div className="hero-img__overlay"></div>
          <Image
            cloudName="huset-cafe-og-motell"
            publicId="menu/hero_vvqqei.webp"
            crop="scale"
            alt="familie som spiser i restauranten"
          >
            <Transformation fetchFormat="auto" crop="scale" />
            <Transformation width="auto" dpr="auto" crop="scale" />
          </Image>
        </div>
      </div>

      <div className="hero-img-mobile">
        <div className="hero-img__overlay"></div>
        <div className="hero__header">
          <h3>Huset Café & Motell</h3>
          <h1>Restaurant</h1>
          <h4>{t('menu:serve')}</h4>
        </div>
        <Image
          cloudName="huset-cafe-og-motell"
          publicId="menu/hero600_tntf9p.webp"
          crop="scale"
          alt="familie som spiser i restauranten"
        >
          <Transformation fetchFormat="auto" crop="scale" />
          <Transformation width="auto" dpr="auto" crop="scale" />
        </Image>
      </div>
      <section className="hero-contact">
        <div className="hero-contact__text">
          <p>{t('menu:serve-text1')}</p>
          <p>{t('menu:serve-text2')}</p>
        </div>
        <div className="hero-contact__location-hint">
          <p>{t('menu:see')}</p>
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
