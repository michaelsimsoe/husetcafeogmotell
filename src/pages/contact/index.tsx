import React from 'react';

import { HeroComponent } from './hero';
import { ContactForm } from './form';
// import { Link } from 'react-router-dom';

export const Contact: React.FunctionComponent = () => {
  return (
    <section className="contact">
      <HeroComponent />
      <ContactForm />
    </section>
  );
};
