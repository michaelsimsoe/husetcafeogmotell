import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useSpring, animated } from 'react-spring';
import { Image } from 'cloudinary-react';

export const HomeEvents: React.FunctionComponent = () => {
  const [ref1, inView1] = useInView({ triggerOnce: true });
  const [ref2, inView2] = useInView({ triggerOnce: true });
  const [ref3, inView3] = useInView({ triggerOnce: true });
  const { t } = useTranslation(['translation', 'home']);

  const animation_style1 = useSpring({
    transform: inView1 ? 'translateX(-5%)' : 'translateX(0)',
  });
  const animation_style2 = useSpring({
    transform: inView2 ? 'translateX(-5%)' : 'translateX(0)',
  });
  const animation_style3 = useSpring({
    transform: inView3 ? 'translateX(-5%)' : 'translateX(0)',
  });
  return (
    <section className="home-section home-events">
      <h2 className="section-heading">{t('home:events-title')}</h2>
      <animated.section
        ref={ref1}
        className="home-events__event"
        style={animation_style1}
      >
        <figure className="event__image">
          <Image
            cloudName="huset-cafe-og-motell"
            publicId="home/nattklubb_w0alyv"
            crop="scale"
          />
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
          <Link to="/" className="cta-link event__link">
            {t('home:events-subs.night.link')}
          </Link>
        </div>
      </animated.section>
      <animated.section
        ref={ref2}
        className="home-events__event home-events__event--reverse"
        style={animation_style2}
      >
        <figure className="event__image">
          <Image
            cloudName="huset-cafe-og-motell"
            publicId="home/sushi-fat_c40e6p"
            crop="scale"
          />
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
          <Link to="/" className="cta-link event__link">
            {t('home:events-subs.sushi.link')}
          </Link>
        </div>
      </animated.section>
      <animated.section
        ref={ref3}
        className="home-events__event"
        style={animation_style3}
      >
        <figure className="event__image">
          <Image
            cloudName="huset-cafe-og-motell"
            publicId="home/privatfest_o9sext"
            crop="scale"
          />
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
          <Link to="/" className="cta-link event__link">
            {t('home:events-subs.private.link')}
          </Link>
        </div>
      </animated.section>
      <Link className="button button-padded" to="/meny#kaker">
        {t('home:events-button')}
      </Link>
    </section>
  );
};
