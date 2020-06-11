import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Transformation } from 'cloudinary-react';

export const HeroComponent: React.FunctionComponent = () => {
  const { t } = useTranslation(['translation', 'events']);
  return (
    <section className="hero events-hero">
      <div className="hero-img-large">
        <div className="hero-img-large__content">
          <div className="hero__header">
            <h3>Huset Café & Motell</h3>
            <h1>
              {t('events:heading1')}
              <br />
              {t('events:heading2')}
            </h1>
            <h4>{t('events:sub-heading')}</h4>
          </div>
          <section className="hero-contact">
            <div className="hero-contact__text">
              <p>{t('events:hero-text1')}</p>
              <p>{t('events:hero-text2')}</p>
            </div>
          </section>
        </div>
        <div className="hero-img-large__images">
          <Image
            cloudName="huset-cafe-og-motell"
            publicId="events/dinner_party_gmyewq.webp"
            crop="scale"
          >
            <Transformation fetchFormat="auto" crop="scale" />
            <Transformation width="auto" dpr="auto" crop="scale" />
          </Image>
          <Image
            cloudName="huset-cafe-og-motell"
            publicId="hjem/moterom_fa1x45.webp"
            crop="scale"
          >
            <Transformation fetchFormat="auto" crop="scale" />
            <Transformation width="auto" dpr="auto" crop="scale" />
          </Image>
          <Image
            cloudName="huset-cafe-og-motell"
            publicId="hjem/privatfest_qq9rsn.webp"
            crop="scale"
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
          <h1>
            {t('events:heading1')}
            <br />
            {t('events:heading2')}
          </h1>
          <h4>{t('events:sub-heading')}</h4>
        </div>
        <Image
          cloudName="huset-cafe-og-motell"
          publicId="arr/dinner_party_600_lq1mg1.webp"
          crop="scale"
        >
          <Transformation fetchFormat="auto" crop="scale" />
          <Transformation width="auto" dpr="auto" crop="scale" />
        </Image>
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
