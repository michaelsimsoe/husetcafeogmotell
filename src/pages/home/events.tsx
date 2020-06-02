import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// Images
import nightClub from './assets/nattklubb.jpg';
import sushiPlate from './assets/sushi-fat.jpg';
import privateEvent from './assets/privatfest.jpg';

export const HomeEvents: React.FunctionComponent = () => {
  const { t } = useTranslation(['translation', 'home']);
  return (
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
            typiske restaurant/nattklubb med dans og bar, men også små intime
            konserter der vi i all hovedsak har ønsker om å presentere noen av
            de fantastiske kunstnere vi har i vår nærhet.
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
            Folk blir mer og mer opptatt av mat, derfor prøver vi å tilby ulike
            arrangementer der mat er hovedfokus, det kan f.eks være Sushiaften,
            viltaften, gourmet/smakskvelder biffaften osv.
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
            Vi legger gjerne til rette for arrengementet deres
          </h4>
          <p className="event__description">
            Vi setter stor pris på det å kunne tilrettelegge for dagen deres,
            enten det er en dag for lystige lag eller noe annet. Vi har
            erfaringer med bursdagsjubileer, barndåper, bryllup,
            begravelsesfester, konfirmasjoner, gjenforeningsfester og så videre.
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
  );
};
