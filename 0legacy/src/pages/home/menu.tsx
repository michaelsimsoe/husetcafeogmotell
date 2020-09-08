import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
// import { animated, useSpring, useTrail, useChain } from 'react-spring';
import { animated, useSpring } from 'react-spring';

// Images
import pizzaImage from './assets/pizza.png';
import hamburgerImage from './assets/hamburger100.png';
import husmannImage from './assets/hus100.png';
import kjottImage from './assets/kjott100.png';

export const HomeMenu: React.FunctionComponent = () => {
  const [ref1, inView1] = useInView();
  const [ref2, inView2] = useInView();
  const [ref3, inView3] = useInView();
  const [ref4, inView4] = useInView();
  const { t } = useTranslation(['translation', 'home']);

  const isDesktopWidth = window.matchMedia('(min-width: 600px)').matches;

  const moveHighLightRight = useSpring({
    transform: inView1
      ? isDesktopWidth
        ? 'translateX(-40px)'
        : 'translateX(0px)'
      : 'translateX(-300px)',
  });
  const spinDishIn = useSpring({
    transform: inView1 ? 'rotate(360deg)' : 'rotate(0deg)',
    transformOrigin: 'center center',
  });

  const moveHighLightRight2 = useSpring({
    transform: inView2
      ? isDesktopWidth
        ? 'translateX(-100px)'
        : 'translateX(0px)'
      : 'translateX(300px)',
  });
  const spinDishIn2 = useSpring({
    transform: inView2 ? 'rotate(360deg)' : 'rotate(0deg)',
    transformOrigin: 'center center',
  });

  const moveHighLightRight3 = useSpring({
    transform: inView3
      ? isDesktopWidth
        ? 'translateX(-40px)'
        : 'translateX(0px)'
      : 'translateX(-300px)',
  });
  const spinDishIn3 = useSpring({
    transform: inView3 ? 'rotate(360deg)' : 'rotate(0deg)',
    transformOrigin: 'center center',
  });

  const moveHighLightRight4 = useSpring({
    transform: inView4
      ? isDesktopWidth
        ? 'translateX(-100px)'
        : 'translateX(0px)'
      : 'translateX(300px)',
  });
  const spinDishIn4 = useSpring({
    transform: inView4 ? 'rotate(360deg)' : 'rotate(0deg)',
    transformOrigin: 'center center',
  });

  return (
    <section className="home-section home-menu">
      <div className="home-menu__big-circle"></div>
      <h2 className="section-heading">{t('home:menu-title')}</h2>
      <animated.section
        style={moveHighLightRight}
        ref={ref1}
        className="home-menu__item"
      >
        <animated.div
          style={moveHighLightRight}
          className="home-menu__small-circle"
        ></animated.div>
        <animated.img style={spinDishIn} src={husmannImage} alt="middag" />
        <div className="home-menu__item-text">
          <h3>{t('home:menu-subs.traditional.name')}</h3>
          <p>{t('home:menu-subs.traditional.desc')}</p>
          <Link className="cta-link" to="/meny ">
            {t('home:menu-subs.traditional.link')}
          </Link>
        </div>
      </animated.section>
      <animated.section
        style={moveHighLightRight2}
        ref={ref2}
        className="home-menu__item home-menu__item--right"
      >
        <animated.div
          className="home-menu__small-circle home-menu__small-circle--right"
          style={moveHighLightRight2}
        ></animated.div>
        <animated.img style={spinDishIn2} src={pizzaImage} alt="pizza" />
        <div className="home-menu__item-text">
          <h3>{t('home:menu-subs.pizza.name')}</h3>
          <p>{t('home:menu-subs.pizza.desc')}</p>
          <Link className="cta-link" to="/meny">
            {t('home:menu-subs.pizza.link')}
          </Link>
        </div>
      </animated.section>
      <animated.section
        ref={ref3}
        style={moveHighLightRight3}
        className="home-menu__item"
      >
        <animated.div
          style={moveHighLightRight3}
          className="home-menu__small-circle"
        ></animated.div>
        <animated.img style={spinDishIn3} src={kjottImage} alt="kjøttmat" />
        <div className="home-menu__item-text">
          <h3>{t('home:menu-subs.meat.name')}</h3>
          <p>{t('home:menu-subs.meat.desc')}</p>
          <Link className="cta-link" to="/meny">
            {t('home:menu-subs.meat.link')}
          </Link>
        </div>
      </animated.section>
      <animated.section
        ref={ref4}
        style={moveHighLightRight4}
        className="home-menu__item home-menu__item--right"
      >
        <animated.div
          style={moveHighLightRight4}
          className="home-menu__small-circle home-menu__small-circle--right"
        ></animated.div>
        <animated.img
          style={spinDishIn4}
          src={hamburgerImage}
          alt="hamburger"
        />
        <div className="home-menu__item-text">
          <h3>{t('home:menu-subs.child.name')}</h3>
          <p>{t('home:menu-subs.child.desc')}</p>
          <Link className="cta-link" to="/meny">
            {t('home:menu-subs.child.link')}
          </Link>
        </div>
      </animated.section>
      <Link className="button button-padded" to="/meny">
        {t('home:menu-cta')}
      </Link>
    </section>
  );
};
