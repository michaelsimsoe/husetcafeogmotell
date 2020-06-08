import React from 'react';
// import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Image } from 'cloudinary-react';

export const HeroComponent: React.FunctionComponent = () => {
  const { t } = useTranslation(['translation', 'events']);
  return (
    <section className="hero events-hero">
      <div className="hero-img-large"></div>
      <div className="hero-img-mobile">
        <div className="hero-img__overlay"></div>
        <div className="hero__header">
          <h3>Huset Café & Motell</h3>
          <h1>
            {t('events:heading1')}
            <br />
            {t('events:heading2')}
          </h1>
          <h4>{t('events:sub-heading')}</h4>
        </div>
        <Image
          cloudName="huset-cafe-og-motell"
          publicId="events/dinner_party_gmyewq"
          crop="scale"
        />
      </div>
      <section className="hero-contact">
        <div className="hero-contact__text">
          <p>{t('events:hero-text1')}</p>
          <p>{t('events:hero-text2')}</p>
        </div>
      </section>
    </section>
  );
};
