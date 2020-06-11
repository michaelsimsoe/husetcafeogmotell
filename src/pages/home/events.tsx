import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useSpring, animated } from 'react-spring';
import { Image, Transformation } from 'cloudinary-react';

export const HomeEvents: React.FunctionComponent = () => {
  const [ref1, inView1] = useInView();
  const [ref2, inView2] = useInView();
  const [ref3, inView3] = useInView();
  const { t } = useTranslation(['translation', 'home']);
  const isDesktopWidth = window.matchMedia('(min-width: 900px)').matches;
  let animation_style1, animation_style2, animation_style3;
  animation_style1 = useSpring({
    transform: inView1 ? 'translateX(-5%)' : 'translateX(0%)',
  });
  animation_style2 = useSpring({
    transform: inView2 ? 'translateX(-5%)' : 'translateX(0%)',
  });
  animation_style3 = useSpring({
    transform: inView3 ? 'translateX(-5%)' : 'translateX(0%)',
  });
  if (!isDesktopWidth) {
    animation_style1 = {};
    animation_style2 = {};
    animation_style3 = {};
  }
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
            publicId="hjem/nattklubb_w0alyv_qazcu3"
            crop="scale"
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
      </animated.section>
      <animated.section
        ref={ref2}
        className="home-events__event home-events__event--reverse"
        style={animation_style2}
      >
        <figure className="event__image">
          <Image
            cloudName="huset-cafe-og-motell"
            publicId="hjem/sushi_fat_ven0rs"
            crop="scale"
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
      </animated.section>
      <animated.section
        ref={ref3}
        className="home-events__event"
        style={animation_style3}
      >
        <figure className="event__image">
          <Image
            cloudName="huset-cafe-og-motell"
            publicId="hjem/privatfest_qq9rsn"
            crop="scale"
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
      </animated.section>
      <Link className="button button-padded" to="/meny#kaker">
        {t('home:events-button')}
      </Link>
    </section>
  );
};
