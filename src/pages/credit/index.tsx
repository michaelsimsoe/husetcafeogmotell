import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

import { HeroComponent } from './hero';
// import { Link } from 'react-router-dom';

interface CreditProps {
  sidebarOpen: (boolean) => void;
}

export const Credit: React.FunctionComponent<CreditProps> = ({
  sidebarOpen,
}) => {
  useEffect(() => {
    const isDesktopWidth = window.matchMedia('(min-width: 600px)').matches;
    if (isDesktopWidth) {
      sidebarOpen(true);
    }
  }, [sidebarOpen]);
  return (
    <section className="contact">
      <Helmet>
        <title>Huset Café & Motell - Anerkjennelse</title>
        <meta
          name="description"
          content="husetmotell.no har benyttet seg av en del materiale fra andre flotte og talentfulle aktører. Her redgjør vi for de vi ikke har anerkjent direkt under de reskektive ressursene"
        />
      </Helmet>
      <HeroComponent />
    </section>
  );
};
