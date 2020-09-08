import React from 'react';
// import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const HeroComponent: React.FunctionComponent = () => {
  const { t } = useTranslation(['translation', 'credit']);
  return (
    <section className="hero credit-hero">
      <div className="hero-img-large">
        <header className="hero__header">
          <h1>{t('credit:landing-heading')}</h1>
        </header>
        <div className="hero-contact-text">
          <h2>{t('credit:bg-title')}</h2>
          <p>
            {t('credit:bg-text')}
            <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>
          </p>
          <a href="https://www.heropatterns.com/">Hero Patterns</a>
          <br />
          <h2>{t('credit:oks-title')}</h2>
          <p>
            {t('credit:oks-text')}
            <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 4.0</a>
          </p>
          <a href="https://commons.wikimedia.org/wiki/File:Okstinden.jpg">
            File:Okstinden.jpg
          </a>
        </div>
      </div>
      <div className="hero-img-mobile">
        <div className="hero__header">
          <h1>{t('contact:landing-heading')}</h1>
        </div>
      </div>
    </section>
  );
};
