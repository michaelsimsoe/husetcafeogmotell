import React, { useEffect } from 'react';

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
      <HeroComponent />
      <ContactForm />
    </section>
  );
};
