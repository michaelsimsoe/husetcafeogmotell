import React from 'react';

import room_one from './assets/rom_en.jpg';
import room_two from './assets/rom_to.jpg';
import frokost_placeholder from './assets/frokost-placeholder.jpg';

export const RoomsContainer: React.FunctionComponent = () => {
  return (
    <section className="rooms-info">
      <section className="rooms-intro">
        <h2 className="section-heading">Rommene våre</h2>
        <div className="rooms-intro__container">
          <div className="rooms-intro__images">
            <figure className="image-carousel">
              <img src={room_one} alt="" />
            </figure>
          </div>
          <div className="rooms-intro__info">
            <div className="info-container">
              <h3>Koselige rom</h3>
              <p>
                Vi tilbyr rene og gode senger, med sengeklær og håndlær klar til
                deg. Rommene er utstyr med TV.
              </p>
            </div>
            <div className="info-container">
              <h3>Rene bad</h3>
              <p>Rene og pene bad til deg som er på farten.</p>
            </div>
            <div className="info-container">
              <h3>Ditt hjem på veien</h3>
              <p>
                Det er ingen steder som hjemme, det vet vi, men vi prøver så
                godt vi kan. Hos oss kan du slappe av.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="rooms double-rooms">
        <h2 className="section-heading">Dobbeltrom</h2>
        <div className="double-rooms__container">
          <figure className="double-rooms__image">
            <img src={room_one} alt="" />
          </figure>
          <div className="info-container">
            <h3>Den riktige størrelsen</h3>
            <p>
              Det er ingen steder som hjemme, det vet vi, men vi prøver så godt
              vi kan. Hos oss kan du slappe av.
            </p>
            <p>Pris 1130,- NOK per natt</p>
            <p>Inkludert frokost</p>
          </div>
        </div>
      </section>
      <section className="rooms single-rooms">
        <h2 className="section-heading">Enkeltrom</h2>
        <div className="single-rooms__container">
          <figure className="single-rooms__image">
            <img src={room_one} alt="" />
          </figure>
          <div className="info-container">
            <h3>Den riktige størrelsen</h3>
            <p>
              Det er ingen steder som hjemme, det vet vi, men vi prøver så godt
              vi kan. Hos oss kan du slappe av.
            </p>
            <p>Pris 1130,- NOK per natt</p>
            <p>Inkludert frokost</p>
          </div>
        </div>
      </section>
      <section className="rooms breakfast full-width">
        <h2 className="section-heading">Frokost</h2>
        <div className="full-width__container">
          <figure className="full-width__figure">
            <div className="img__overlay"></div>
            <img src={frokost_placeholder} alt="frokost buffet" />
          </figure>
        </div>
        <div className="full-width__content">
          <h3>Vi tilbyr en selvbetjent frokost</h3>
          <p>
            Vi har et dedikert frokostrom til gjestene våre hvor vi tilbyr en
            tradisjonell norsk frokost til gjestene våre.
          </p>
        </div>
      </section>
      <section className="rooms information">
        <div className="info-container">
          <h3>Våre lokaler</h3>
          <p>Informasjon om våre lokaler</p>
        </div>
        <div className="info-container">
          <h3>Husreglene</h3>
          <p>Informasjon om våre husregler</p>
        </div>
        <div className="info-container">
          <h3>Området rundt</h3>
          <p>Informasjon om våre området rundt</p>
        </div>
      </section>
    </section>
  );
};
