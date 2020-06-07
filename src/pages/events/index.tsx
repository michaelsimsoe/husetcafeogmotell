import React from 'react';
import { HeroComponent } from './hero';

import consert from './assets/konsert.jpg';
import pub from './assets/pub.jpg';
import table from './assets/dekket_bord.jpg';
import { EventCarousel } from './eventCarousel';

// Images
import biff from './assets/biff.jpg';
import biff2 from './assets/biff2.jpg';
import biff3 from './assets/biff3.jpg';
import sushi from './assets/sushi.jpg';
import sushi2 from './assets/sushi2.png';
import sushi3 from './assets/sushi3.jpg';
import sushi4 from './assets/sushi4.jpg';
import sushi5 from './assets/sushi5.jpg';
import viltaften from './assets/viltaften.jpg';
import viltaften2 from './assets/viltaften2.jpg';
import viltaften3 from './assets/viltaften3.jpg';

export const Events: React.FunctionComponent = () => {
  return (
    <div className="events">
      <HeroComponent />
      <section className="events-events">
        <h2 className="section-heading">Arrangementer</h2>
        <div className="events__container">
          <figure className="single-rooms__image">
            <img src={consert} alt="" />
          </figure>
          <div className="info-container">
            <h3>Konserter</h3>
            <p>
              Vi setter virkelig pris på det lokale talentet som befinner seg i
              kommunen og omegn, spesielt når de kommer og spiller for oss. Vi
              liker konserter, spesielt de litt mindre og intime.
            </p>
            <p>
              Følge med på facebookgruppen vår for mer informasjon om de neste
              arrangementene.
            </p>
            <a href="https://www.facebook.com/Husetcafe">
              Huset Café og Motell på facebook
            </a>
          </div>
        </div>
        <div className="events__container">
          <figure className="single-rooms__image">
            <img src={pub} alt="" />
          </figure>
          <div className="info-container">
            <h3>Pub og Nattklubb</h3>
            <p>
              Vi har alle behov for å komme oss ut en tur, og noen ganger bør
              den turen være hit til oss for å treffe folk, høre på litt musikk
              og lette litt på trykket. Vi kjører regelmessige pub- eller
              nattklubbkvelder, ofte beriket med en lokal DJ eller en reisende
              trubadur.
            </p>
            <p>
              Følge med på facebookgruppen vår for mer informasjon om de neste
              arrangementene.
            </p>
            <a href="https://www.facebook.com/Husetcafe">
              Huset Café og Motell på facebook
            </a>
          </div>
        </div>
        <div className="events__container">
          <figure className="single-rooms__image">
            <img src={table} alt="" />
          </figure>
          <div className="info-container">
            <h3>Søndagsmiddag</h3>
            <p>
              Det har vært en lang uke med mange opplevelser. Da trenger du å
              slappe av og la noen andre ta seg av matlagingen. Kom å ta
              søndagsmiddagen hos oss. Vi lager noe godt til deg og så tar vi
              oss av oppvasken slik at du kan bruke dagen til noe annet fint.
            </p>
          </div>
        </div>
      </section>
      <section className="events-special">
        <h2 className="section-heading">Spesielle Arrangementer</h2>
        <div className="events__container">
          <figure className="event__image">
            <EventCarousel images={[sushi, sushi2, sushi3, sushi4, sushi5]} />
          </figure>
          <div className="info-container">
            <h3>Sushiaften</h3>
            <p>
              Folk blir mer og mer opptatt av mat, derfor prøver vi å tilby
              ulike arrangementer der mat er hovedfokus, det kan f.eks være
              Sushiaften, viltaften, gourmet/smakskvelder biffaften osv.
            </p>
          </div>
        </div>
        <div className="events__container">
          <figure className="event__image">
            <EventCarousel images={[biff, biff2, biff3]} />
          </figure>
          <div className="info-container">
            <h3>Biffaften</h3>
            <p>
              Folk blir mer og mer opptatt av mat, derfor prøver vi å tilby
              ulike arrangementer der mat er hovedfokus, det kan f.eks være
              Sushiaften, viltaften, gourmet/smakskvelder biffaften osv.
            </p>
          </div>
        </div>
        <div className="events__container">
          <figure className="event__image">
            <EventCarousel images={[viltaften, viltaften2, viltaften3]} />
          </figure>
          <div className="info-container">
            <h3>Viltaften</h3>
            <p>
              Folk blir mer og mer opptatt av mat, derfor prøver vi å tilby
              ulike arrangementer der mat er hovedfokus, det kan f.eks være
              Sushiaften, viltaften, gourmet/smakskvelder biffaften osv.
            </p>
          </div>
        </div>
      </section>
      <section className="events-services"></section>
    </div>
  );
};
