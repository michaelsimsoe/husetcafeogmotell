import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Image, Transformation } from 'cloudinary-react';

export const HomeEvents: React.FunctionComponent = () => {

  const { t } = useTranslation(['translation', 'home']);

  return (
    <section className="home-section home-events">
      <h2 className="section-heading">{t('home:events-title')}</h2>
      <section className="home-events__event">
        <figure className="event__image">
          <Image
            cloudName="huset-cafe-og-motell"
            publicId="hjem/nattklubb_w0alyv_qazcu3"
            crop="scale"
            alt="nattklubb"
          >
            <Transformation quality="auto" fetchFormat="auto" crop="scale" />
            <Transformation width="auto" dpr="auto" crop="scale" />
          </Image>
        </figure>
        <div className="event__content">
          <h3 className="event__heading">
            {t('home:events-subs.night.title')}
          </h3>
          <h4 className="event__sub-heading">
            {t('home:events-subs.night.sub')}
          </h4>
          <p className="event__description">
            {t('home:events-subs.night.desc')}
          </p>
          <Link to="/arrangementer" className="cta-link event__link">
            {t('home:events-subs.night.link')}
          </Link>
        </div>
      </section>
      <section className="home-events__event home-events__event--reverse">
        <figure className="event__image">
          <Image
            cloudName="huset-cafe-og-motell"
            publicId="hjem/sushi_fat_ven0rs"
            crop="scale"
            alt="fat med sushi"
          >
            <Transformation quality="auto" fetchFormat="auto" crop="scale" />
            <Transformation width="auto" dpr="auto" crop="scale" />
          </Image>
        </figure>
        <div className="event__content">
          <h3 className="event__heading">
            {t('home:events-subs.sushi.title')}
          </h3>
          <h4 className="event__sub-heading">
            {t('home:events-subs.sushi.sub')}
          </h4>
          <p className="event__description">
            {t('home:events-subs.sushi.desc')}
          </p>
          <Link to="/arrangementer" className="cta-link event__link">
            {t('home:events-subs.sushi.link')}
          </Link>
        </div>
      </section>
      <section className="home-events__event">
        <figure className="event__image">
          <Image
            cloudName="huset-cafe-og-motell"
            publicId="hjem/privatfest_qq9rsn"
            crop="scale"
            alt="privat arrangement"
          >
            <Transformation quality="auto" fetchFormat="auto" crop="scale" />
            <Transformation width="auto" dpr="auto" crop="scale" />
          </Image>
        </figure>
        <div className="event__content">
          <h3 className="event__heading">
            {t('home:events-subs.private.title')}
          </h3>
          <h4 className="event__sub-heading">
            {t('home:events-subs.private.sub')}
          </h4>
          <p className="event__description">
            {t('home:events-subs.private.desc')}
          </p>
          <Link to="/arrangementer" className="cta-link event__link">
            {t('home:events-subs.private.link')}
          </Link>
        </div>
      </section>
      <Link className="button button-padded" to="/meny#kaker">
        {t('home:events-button')}
      </Link>
    </section>
  );
};
