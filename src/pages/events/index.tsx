import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Image } from 'cloudinary-react';

import { HeroComponent } from './hero';
import { EventCarousel } from './eventCarousel';
import { TFunction } from 'i18next';

export const Events: React.FunctionComponent = () => {
  const { t } = useTranslation(['translation', 'events']);
  return (
    <div className="events">
      <HeroComponent />
      <section className="events-events">
        <h2 className="section-heading">{t('events:events')}</h2>
        <div className="events__container">
          <figure className="events__container__image">
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
          <figure className="events__container__image">
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
          <figure className="events__container__image">
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
        <p>
          We know that people are getting more and more interested in
          experiencing food and we want to deliver that experience in the
          comfortable and social context of Huse Cafe and Motel. Therefore we
          are hosting various theme evenings from sushi to meat from the
          wilderness.
        </p>
        <SpecialEventContainer
          images={[
            'sushi_uzlwu6',
            'sushi2_ve9yk7',
            'sushi4_nfyp2m',
            'sushi3_ghh9jf',
            'sushi5_umfml8',
          ]}
        >
          {{
            title: t('events:sushi'),
            text: t('events:sushi-text'),
          }}
        </SpecialEventContainer>
        <SpecialEventContainer
          images={['biff_bxzcrx', 'biff2_b2ozvi', 'biff3_tbb2yp']}
        >
          {{
            title: t('events:steak'),
            text: t('events:steak-text'),
          }}
        </SpecialEventContainer>
        <SpecialEventContainer
          images={[
            'viltaften_nveze4',
            'viltaften3_js7mmm',
            'viltaften2_kytp70',
          ]}
        >
          {{
            title: t('events:game'),
            text: t('events:game-text'),
          }}
        </SpecialEventContainer>
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

interface SpecialEventProps {
  images: string[];
  children: {
    title: TFunction;
    text: TFunction;
  };
}

const SpecialEventContainer: React.FunctionComponent<SpecialEventProps> = (
  props
) => {
  const mainImage = useRef<HTMLImageElement>(null);
  const thumbClick = (e) => {
    console.log(this);
    console.log(e.target.src);
    console.log('clicked');
    (mainImage as any).current.getElementsByTagName('img')[0].src =
      e.target.src;
  };
  return (
    <div className="events__container">
      <figure ref={mainImage} className="event__image">
        <Image
          cloudName="huset-cafe-og-motell"
          publicId={`events/${props.images[0]}`}
          crop="scale"
          className="event__image-image"
        />
        <div className="carousel-wrapper">
          <EventCarousel images={[...props.images]} />
        </div>
      </figure>
      <div className="info-container">
        <h3>{props.children.title}</h3>
        <p>{props.children.text}</p>
      </div>
      <div className="event__image-thumbnails">
        {props.images.map((image) => {
          return (
            <Image
              onClick={thumbClick}
              cloudName="huset-cafe-og-motell"
              publicId={`events/${image}`}
              crop="scale"
              className="thumbnail"
            />
          );
        })}
      </div>
    </div>
  );
};
