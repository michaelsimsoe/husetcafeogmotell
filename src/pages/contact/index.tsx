import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

import { HeroComponent } from './hero';
import { ContactForm } from './form';
// import { Link } from 'react-router-dom';

interface ContactProps {
  sidebarOpen: (boolean) => void;
}

export const Contact: React.FunctionComponent<ContactProps> = ({
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
        <title>Huset Café & Motell - Kontakt oss</title>
        <meta
          name="description"
          content="Kontakt Huset Café & Motell. Send oss en e-post, bruk webskjemaet, eller ring oss på 40 31 73 53"
        />
      </Helmet>
      <HeroComponent />
      <ContactForm />
    </section>
  );
};
