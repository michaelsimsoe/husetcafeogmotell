import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useSpring, animated } from 'react-spring';

// Images
import nightClub from './assets/nattklubb.jpg';
import sushiPlate from './assets/sushi-fat.jpg';
import privateEvent from './assets/privatfest.jpg';

export const HomeEvents: React.FunctionComponent = () => {
  const [ref1, inView1] = useInView({ triggerOnce: true });
  const [ref2, inView2] = useInView({ triggerOnce: true });
  const [ref3, inView3] = useInView({ triggerOnce: true });
  const { t } = useTranslation(['translation', 'home']);

  const animation_style1 = useSpring({
    transform: inView1 ? 'translateX(-5%)' : 'translateX(0)',
  });
  const animation_style2 = useSpring({
    transform: inView2 ? 'translateX(-5%)' : 'translateX(0)',
  });
  const animation_style3 = useSpring({
    transform: inView3 ? 'translateX(-5%)' : 'translateX(0)',
  });
  return (
    <section className="home-section home-events">
      <h2 className="section-heading">{t('home:events-title')}</h2>
      <animated.section
        ref={ref1}
        className="home-events__event"
        style={animation_style1}
      >
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
      </animated.section>
      <animated.section
        ref={ref2}
        className="home-events__event home-events__event--reverse"
        style={animation_style2}
      >
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
      </animated.section>
      <animated.section
        ref={ref3}
        className="home-events__event"
        style={animation_style3}
      >
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
      </animated.section>
      <Link className="button button-padded" to="/meny#kaker">
        {t('home:events-button')}
      </Link>
    </section>
  );
};
