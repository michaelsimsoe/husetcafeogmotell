import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

import twoTimesRooms from './assets/roomsx2.jpg';
import pizzaImage from './assets/pizza.png';
import cakeBuffet from './assets/kaker.jpg';
import nightClub from './assets/nattklubb.jpg';
import sushiPlate from './assets/sushi-fat.jpg';
import privateEvent from './assets/privatfest.jpg';
import catering from './assets/catering.jpg';

// Components
import MapLocation from '../../components/map/mapContainer';
import { HeroComponent } from './hero';

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
        <section ref={ref} className="home-section home-rooms">
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
        <section className="home-section home-menu">
          <div className="home-menu__big-circle"></div>
          <h2 className="section-heading">{t('home:menu-title')}</h2>
          <section className="home-menu__item">
            <img src={pizzaImage} alt="pizza" />
            <div className="home-menu__item-text">
              <h3>Pizza</h3>
              <p>Vi har kanskje Norges beste pizza</p>
              <Link className="cta-link" to="/">
                Pizzamenyen
              </Link>
            </div>
          </section>
          <section className="home-menu__item">
            <img src={pizzaImage} alt="pizza" />
            <div className="home-menu__item-text">
              <h3>Kjøtt og Kebab</h3>
              <p>Vi har et godt utvalg av kjøtt og flere typer kebab.</p>
              <Link className="cta-link" to="/">
                Kjøtt
              </Link>
            </div>
          </section>
          <section className="home-menu__item">
            <img src={pizzaImage} alt="pizza" />
            <div className="home-menu__item-text">
              <h3>Husmannskost</h3>
              <p>Vi har typisk norsk hjemmelaget kost</p>
              <Link className="cta-link" to="/">
                Husmannskost
              </Link>
            </div>
          </section>
          <section className="home-menu__item">
            <img src={pizzaImage} alt="pizza" />
            <div className="home-menu__item-text">
              <h3>Barnemeny</h3>
              <p>Vi har en fin barnemeny</p>
              <Link className="cta-link" to="/">
                Barnemeny
              </Link>
            </div>
          </section>
          <Link className="button button-padded" to="/meny">
            Se maten vi lager
          </Link>
        </section>
        <section className="home-section home-cakes">
          <h2 className="section-heading">{t('home:cake-title')}</h2>
          <div className="home-cakes__container">
            <figure>
              <div className="img__overlay"></div>
              <img src={cakeBuffet} alt="cake buffet" />
            </figure>
            <div className="home-cakes__content">
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
        <section className="home-section home-events">
          <h2 className="section-heading">{t('home:events-title')}</h2>
          <section className="home-events__event">
            <figure className="event__image">
              <img src={nightClub} alt="" />
            </figure>
            <div className="event__content">
              <h3 className="event__heading">Konserter, bar og nattklubb</h3>
              <h4 className="event__sub-heading">Det er viktig å ha det gøy</h4>
              <p className="event__description">
                Huset Cafe arrangerer ofte kvelder med fin musikk, det kan være
                typiske restaurant/nattklubb med dans og bar, men også små
                intime konserter der vi i all hovedsak har ønsker om å
                presentere noen av de fantastiske kunstnere vi har i vår nærhet.
              </p>
              <Link to="/" className="cta-link event__link">
                Les mer om dette
              </Link>
            </div>
          </section>
          <section className="home-events__event home-events__event--reverse">
            <figure className="event__image">
              <img src={sushiPlate} alt="" />
            </figure>
            <div className="event__content">
              <h3 className="event__heading">Sushikveld</h3>
              <h4 className="event__sub-heading">Moderne fisk</h4>
              <p className="event__description">
                Folk blir mer og mer opptatt av mat, derfor prøver vi å tilby
                ulike arrangementer der mat er hovedfokus, det kan f.eks være
                Sushiaften, viltaften, gourmet/smakskvelder biffaften osv.
              </p>
              <Link to="/" className="cta-link event__link">
                Les mer om dette
              </Link>
            </div>
          </section>
          <section className="home-events__event">
            <figure className="event__image">
              <img src={privateEvent} alt="" />
            </figure>
            <div className="event__content">
              <h3 className="event__heading">Private arrangementer</h3>
              <h4 className="event__sub-heading">
                Vi legger gjerne til rette for festen deres
              </h4>
              <p className="event__description">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo,
                earum. Mollitia amet incidunt repellat maiores autem, maxime
                fugiat vero deserunt, expedita repellendus nostrum tempora sint
                beatae quam ad dicta quibusdam!
              </p>
              <Link to="/" className="cta-link event__link">
                Les mer om dette
              </Link>
            </div>
          </section>
          <Link className="button button-padded" to="/meny#kaker">
            {t('home:events-button')}
          </Link>
        </section>
        <section className="home-section home-cakes">
          <h2 className="section-heading">Vi tilbyr catering</h2>
          <div className="home-cakes__container">
            <figure>
              <div className="img__overlay"></div>
              <img src={catering} alt="catering buffet" />
            </figure>
            <div className="home-cakes__content">
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
