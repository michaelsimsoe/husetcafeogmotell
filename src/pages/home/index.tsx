import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

import twoTimesRooms from './assets/roomsx2.jpg';
import cakeBuffet from './assets/kaker.jpg';
import catering from './assets/catering.jpg';

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
    sidebarOpen(inView);
  }, [sidebarOpen, inView]);

  return (
    <div className="home">
      <HeroComponent />
      <div ref={ref} className="home-main-content">
        <section className="home-section map-mobile">
          <MapLocation />
          <div>
            <p>
              Huset Cafe & Motell er en veikro som ligger tett inntil E6 gjennom{' '}
              <a href="https://no.wikipedia.org/wiki/Hemnes">Hemnes Kommune.</a>
            </p>
            <p>
              Vi har som formål å tjene veifarende og turister, samt at vi er et
              viktig samlingspunkt for lokalbefolkningen.
            </p>
            <p>
              Vi vil alltid prøve å ha et prisnivå på våre tjenester som er
              konkurransedyktige og attraktive
            </p>
          </div>
        </section>
        <section className="home-section home-rooms">
          <h2 className="section-heading">{t('home:rooms-title')}</h2>
          <div className="home-rooms__container">
            <figure className="home-rooms__image">
              <img src={twoTimesRooms} alt="double and single room" />
            </figure>
            <div className="home-rooms__content">
              <h3 className="section-sub-heading home-rooms__sub-heading">
                Rimelige og Komfortable rom
              </h3>
              <p>Vi har 8 rom tilgjengelig. Frokost er inkludert i prisen.</p>
              <ul>
                <li>Enkeltrom 890,-</li>
                <li>Dobbeltrom 1130,-</li>
              </ul>
              <div className="home-rooms__buttons">
                <Link className="button button-padded" to="/kontakt">
                  Kontakt oss
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
              <img src={cakeBuffet} alt="cake buffet" />
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
          <h2 className="section-heading">Vi tilbyr catering</h2>
          <div className="full-width__container">
            <figure className="full-width__figure">
              <div className="img__overlay"></div>
              <img src={catering} alt="catering buffet" />
            </figure>
            <div className="full-width__content">
              <h3 className="section-sub-heading section-sub-heading--white">
                For enhver anledning
              </h3>
              <p>Koldtbort, varmat, snitter eller det du måtte ønske</p>
              <Link className="cta-link" to="/meny#kaker">
                Les om cateringmulighetene
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
