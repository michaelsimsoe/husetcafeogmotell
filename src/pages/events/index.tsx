import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Transformation } from 'cloudinary-react';
import { useInView } from 'react-intersection-observer';

import { HeroComponent } from './hero';
import { EventCarousel } from './eventCarousel';
import { TFunction } from 'i18next';
interface EventsProps {
  sidebarOpen: (boolean) => void;
}

export const Events: React.FunctionComponent<EventsProps> = ({
  sidebarOpen,
}) => {
  const { t } = useTranslation(['translation', 'events']);
  const [ref, inView] = useInView({ rootMargin: '-300px' });

  useEffect(() => {
    const isDesktopWidth = window.matchMedia('(min-width: 600px)').matches;
    if (isDesktopWidth) {
      sidebarOpen(inView);
    }
  }, [sidebarOpen, inView]);

  return (
    <div className="events">
      <HeroComponent />
      <main ref={ref}>
        <section className="events-events">
          <h2 className="section-heading">{t('events:events')}</h2>
          <div className="events__container">
            <figure className="events__container__image">
              <Image
                cloudName="huset-cafe-og-motell"
                publicId="events/konsert_imlgki"
                crop="scale"
              >
                <Transformation fetchFormat="auto" crop="scale" />
                <Transformation width="auto" dpr="auto" crop="scale" />
              </Image>
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
              >
                <Transformation fetchFormat="auto" crop="scale" />
                <Transformation width="auto" dpr="auto" crop="scale" />
              </Image>
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
              >
                <Transformation fetchFormat="auto" crop="scale" />
                <Transformation width="auto" dpr="auto" crop="scale" />
              </Image>
            </figure>
            <div className="info-container">
              <h3>{t('events:sunday')}</h3>
              <p>{t('events:sunday-text')}</p>
            </div>
          </div>
        </section>
        <section className="events-special">
          <h2 className="section-heading">{t('events:special')}</h2>
          <p className="events-special__intro">{t('events:special-intro')}</p>
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
            <figure className="info-container__image">
              <Image
                cloudName="huset-cafe-og-motell"
                publicId="events/pub_zfwx70"
                crop="scale"
              >
                <Transformation fetchFormat="auto" crop="scale" />
                <Transformation width="auto" dpr="auto" crop="scale" />
              </Image>
            </figure>
            <div className="info-container__content">
              <h3>{t('events:meet')}</h3>
              <p>{t('events:meet-text')}</p>
              <p>{t('events:meet-big')}</p>
              <p>{t('events:meet-small')}</p>
            </div>
          </div>
          <div className="info-container">
            <figure className="info-container__image">
              <Image
                cloudName="huset-cafe-og-motell"
                publicId="events/pub_zfwx70"
                crop="scale"
              >
                <Transformation fetchFormat="auto" crop="scale" />
                <Transformation width="auto" dpr="auto" crop="scale" />
              </Image>
            </figure>
            <div className="info-container__content">
              <h3>{t('events:premises')}</h3>
              <p>{t('events:premises-text1')}</p>
              <p>{t('events:premises-text2')}</p>
              <p>{t('events:premises-text3')}</p>
            </div>
          </div>
        </section>
      </main>
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
  const [slide, setSlide] = useState<boolean>(false);
  const mainImage = useRef<HTMLImageElement>(null);
  const thumbClick = (e) => {
    setSlide(true);
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
          className={
            slide
              ? 'event__image-image event__image-image--slide'
              : 'event__image-image'
          }
          onAnimationEnd={() => setSlide(false)}
        >
          <Transformation fetchFormat="auto" crop="scale" />
          <Transformation width="auto" dpr="auto" crop="scale" />
        </Image>
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
            >
              <Transformation fetchFormat="auto" crop="scale" />
              <Transformation width="auto" dpr="auto" crop="scale" />
            </Image>
          );
        })}
      </div>
    </div>
  );
};
