import React from 'react';
// import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';

import dinner_party from './assets/dinner_party.jpg';

export const HeroComponent: React.FunctionComponent = () => {
  // const { t } = useTranslation(['translation', 'home']);
  return (
    <section className="hero events-hero">
      <div className="hero-img-large"></div>
      <div className="hero-img-mobile">
        <div className="hero-img__overlay"></div>
        <div className="hero__header">
          <h3>Huset Café & Motell</h3>
          <h1>
            Arrangementer
            <br />
            og Tjenester
          </h1>
          <h4>Vi har mye å by på</h4>
        </div>
        <img src={dinner_party} alt="group having dinner together" />
      </div>
      <section className="hero-contact">
        <div className="hero-contact__text">
          <p>
            Huset Café & Motell offers events and services like intimate
            concerts, full on nightclub evenings, meetings and conferences and
            various other events.
          </p>
          <p>
            We also take pride in organizing theme nights like sushi evening and
            wildlife food evenings.
          </p>
        </div>
      </section>
    </section>
  );
};
