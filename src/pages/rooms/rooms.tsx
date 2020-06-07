import React from 'react';

import room_one from './assets/rom_en.jpg';
// import room_two from './assets/rom_to.jpg';
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
            <div className="info-container__price">
              <p>Pris 1130,- NOK per natt</p>
              <p>Inkludert frokost</p>
            </div>
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
            <div className="info-container__price">
              <p>Pris 890,- NOK per natt</p>
              <p>Inkludert frokost</p>
            </div>
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
          <div className="full-width__content">
            <h3>Vi tilbyr en selvbetjent frokost</h3>
            <p>
              Vi har et dedikert frokostrom til gjestene våre hvor vi tilbyr en
              tradisjonell norsk frokost til gjestene våre.
            </p>
          </div>
        </div>
      </section>
      <section className="rooms information">
        <div className="info-container">
          <h3>Huset Café og Motell</h3>
          <p>
            Vi har en behagelig cafe og restaurant hvor vi serverer både lunsj,
            middag, kos eller bare en kopp kaffe. Det er selvfølgelig også
            servering utendørs.
          </p>
        </div>
        <div className="info-container">
          <h3>Husreglene</h3>
          <p>
            Vi tar imot betalingen for rom når du ankommer, med mindre annet er
            avtalt.{' '}
          </p>
          <p>
            Tidligste tidspunkt for innsjekk er klokken 14:00. Kommer du sent
            skal vi finne en løsning på det.
          </p>
          <p>Vi har utsjekk klokken 12:00</p>
        </div>
        <div className="info-container info-container__area">
          <h3>Området rundt</h3>
          <p>Huset Café og Motell ligger i det som blir Korgen Sentrum.</p>
          <h4>Korgensenteret</h4>
          <p>
            Vi har et koselig kjøpesenter rett ved siden av oss. Her får tak i
            det meste du trenger, fra dagligvarer, apotek og vinmonopol til en
            hårklipp.
          </p>
          <a href="https://www.facebook.com/pages/category/Shopping---Retail/Korgensenteret-808018572706977/">
            Korgensenteret på Facebook
          </a>
          <h4>Bensinstasjon</h4>
          <p>Rett over veien har vi Circle K Korgen</p>
          <a href="https://www.facebook.com/circlekkorgen/posts/309648532524260/">
            Circke K Korgen på Facebook
          </a>
          <h4>Hemnes Kommune og Helgeland</h4>
          <p>Vi har en flott kommune med mye spennende å by på.</p>
          <a href="https://www.hemnes.kommune.no/">Hemnes Kommune</a>
          <h4>Okstindan natur- og kulturpark</h4>
          <p>
            Nord i kommunen har vi fantastiske Okstindan natur- og kulturpark,
            med tinder, isbre og den flott Rabothytta.
          </p>
          <a href="https://visitokstindan.com/">Visitokstindan.com</a>
        </div>
      </section>
    </section>
  );
};
