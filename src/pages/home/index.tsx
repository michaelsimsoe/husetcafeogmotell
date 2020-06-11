import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { Image, Transformation } from 'cloudinary-react';

// Components
import MapLocation from '../../components/map/mapContainer';
import { HeroComponent } from './hero';
import { HomeMenu } from './menu';
import { HomeEvents } from './events';

interface HomeProps {
  sidebarOpen: (boolean) => void;
}

export const Home: React.FunctionComponent<HomeProps> = ({ sidebarOpen }) => {
  const { t } = useTranslation(['translation', 'home']);
  const [ref, inView] = useInView({ rootMargin: '-300px' });

  useEffect(() => {
    const isDesktopWidth = window.matchMedia('(min-width: 600px)').matches;
    if (isDesktopWidth) {
      sidebarOpen(inView);
    }
  }, [sidebarOpen, inView]);

  return (
    <div className="home">
      <HeroComponent />
      <div ref={ref} className="home-main-content">
        <section className="home-section map-mobile">
          <MapLocation />
          <div>
            <p>
              {t('home:map1')}{' '}
              <a href="https://no.wikipedia.org/wiki/Hemnes">Hemnes Kommune.</a>
            </p>
            <p>{t('home:map2')}</p>
            <p>{t('home:map3')}</p>
          </div>
        </section>
        <section className="home-section home-rooms">
          <h2 className="section-heading">{t('home:rooms-title')}</h2>
          <div className="home-rooms__container">
            <figure className="home-rooms__image">
              <Image
                cloudName="huset-cafe-og-motell"
                publicId="hjem/roomsx2_kf3aoo"
                crop="scale"
              >
                <Transformation
                  quality="auto"
                  fetchFormat="auto"
                  crop="scale"
                />
                <Transformation width="auto" dpr="auto" crop="scale" />
              </Image>
            </figure>
            <div className="home-rooms__content">
              <h3 className="section-sub-heading home-rooms__sub-heading">
                {t('home:rooms-sub-title')}
              </h3>
              <p>{t('home:rooms-information')}</p>
              <ul>
                <li>{t('home:rooms-single')} 890,-</li>
                <li>{t('home:rooms-double')} 1130,-</li>
              </ul>
              <div className="home-rooms__buttons">
                <Link className="button button-padded" to="/kontakt">
                  {t('translation:buttons.contact')}
                </Link>
                <div>
                  <Link className="cta-link home-rooms__link" to="/overnatting">
                    {t('home:rooms-cta-link')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <HomeMenu />
        <section className="home-section full-width">
          <h2 className="section-heading">{t('home:cake-title')}</h2>
          <div className="full-width__container">
            <figure className="full-width__figure">
              <div className="img__overlay"></div>
              <Image
                cloudName="huset-cafe-og-motell"
                publicId="hjem/kaker_luc0f6"
              >
                <Transformation
                  quality="auto"
                  fetchFormat="auto"
                  crop="scale"
                />
                <Transformation width="auto" dpr="auto" crop="scale" />
              </Image>
            </figure>
            <div className="full-width__content">
              <h3 className="section-sub-heading section-sub-heading--white">
                {t('home:cake-sub-heading')}
              </h3>
              <Link className="cta-link" to="/meny#kaker">
                {t('home:cake-cta-link')}
              </Link>
              <Link className="button button-padded" to="/meny#kake-bestilling">
                {t('home:cake-button')}
              </Link>
            </div>
          </div>
        </section>
        <HomeEvents />
        <section className="home-section full-width">
          <h2 className="section-heading">{t('home:catering-heading')}</h2>
          <div className="full-width__container">
            <figure className="full-width__figure">
              <div className="img__overlay"></div>
              <Image
                cloudName="huset-cafe-og-motell"
                publicId="hjem/catering_jhi8jv"
              >
                <Transformation
                  quality="auto"
                  fetchFormat="auto"
                  crop="scale"
                />
                <Transformation width="auto" dpr="auto" crop="scale" />
              </Image>
            </figure>
            <div className="full-width__content">
              <h3 className="section-sub-heading section-sub-heading--white">
                {t('home:catering-sub-heading')}
              </h3>
              <p>{t('home:catering-text')}</p>
              <Link className="cta-link" to="/meny#catering">
                {t('home:catering-link')}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
