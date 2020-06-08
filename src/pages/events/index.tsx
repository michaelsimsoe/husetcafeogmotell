import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image } from 'cloudinary-react';

import { HeroComponent } from './hero';
import { EventCarousel } from './eventCarousel';

export const Events: React.FunctionComponent = () => {
  const { t } = useTranslation(['translation', 'events']);
  return (
    <div className="events">
      <HeroComponent />
      <section className="events-events">
        <h2 className="section-heading">{t('events:events')}</h2>
        <div className="events__container">
          <figure className="single-rooms__image">
            <Image
              cloudName="huset-cafe-og-motell"
              publicId="events/konsert_imlgki"
              crop="scale"
            />
          </figure>
          <div className="info-container">
            <h3>{t('events:concert')}</h3>
            <p>{t('events:concert-text')}</p>
            <p>{t('events:concert-fb')}</p>
            <a href="https://www.facebook.com/Husetcafe">
              {t('events:concert-link')}
            </a>
          </div>
        </div>
        <div className="events__container">
          <figure className="single-rooms__image">
            <Image
              cloudName="huset-cafe-og-motell"
              publicId="events/pub_zfwx70"
              crop="scale"
            />
          </figure>
          <div className="info-container">
            <h3>{t('events:pub')}</h3>
            <p>{t('events:pub-text')}</p>
            <p>{t('events:pub-fb')}</p>
            <a href="https://www.facebook.com/Husetcafe">
              {t('events:pub-link')}
            </a>
          </div>
        </div>
        <div className="events__container">
          <figure className="single-rooms__image">
            <Image
              cloudName="huset-cafe-og-motell"
              publicId="events/dekket_bord_gzaxyh"
              crop="scale"
            />
          </figure>
          <div className="info-container">
            <h3>{t('events:sunday')}</h3>
            <p>{t('events:sunday-text')}</p>
          </div>
        </div>
      </section>
      <section className="events-special">
        <h2 className="section-heading">{t('events:special')}</h2>
        <div className="events__container">
          <figure className="event__image">
            <EventCarousel
              images={[
                'sushi_uzlwu6',
                'sushi2_ve9yk7',
                'sushi4_nfyp2m',
                'sushi3_ghh9jf',
                'sushi5_umfml8',
              ]}
            />
          </figure>
          <div className="info-container">
            <h3>{t('events:sushi')}</h3>
            <p>{t('events:sushi-text')}</p>
          </div>
        </div>
        <div className="events__container">
          <figure className="event__image">
            <EventCarousel
              images={['biff_bxzcrx', 'biff2_b2ozvi', 'biff3_tbb2yp']}
            />
          </figure>
          <div className="info-container">
            <h3>{t('events:steak')}</h3>
            <p>{t('events:steak-text')}</p>
          </div>
        </div>
        <div className="events__container">
          <figure className="event__image">
            <EventCarousel
              images={[
                'viltaften_nveze4',
                'viltaften3_js7mmm',
                'viltaften2_kytp70',
              ]}
            />
          </figure>
          <div className="info-container">
            <h3>{t('events:game')}</h3>
            <p>{t('events:game-text')}</p>
          </div>
        </div>
      </section>
      <section className="events-services information">
        <h2 className="section-heading">{t('events:services')}</h2>
        <div className="info-container">
          <h3>{t('events:meet')}</h3>
          <p>{t('events:meet-text')}</p>
          <p>{t('events:meet-big')}</p>
          <p>{t('events:meet-small')}</p>
        </div>
        <div className="info-container">
          <h3>{t('events:premises')}</h3>
          <p>{t('events:premises-text1')}</p>
          <p>{t('events:premises-text2')}</p>
          <p>{t('events:premises-text3')}</p>
        </div>
      </section>
    </div>
  );
};
