import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// Images
import pizzaImage from './assets/pizza.png';

export const HomeMenu: React.FunctionComponent = () => {
  const { t } = useTranslation(['translation', 'home']);
  return (
    <section className="home-section home-menu">
      <div className="home-menu__big-circle"></div>
      <h2 className="section-heading">{t('home:menu-title')}</h2>
      <section className="home-menu__item">
        <div className="home-menu__small-circle"></div>
        <img src={pizzaImage} alt="pizza" />
        <div className="home-menu__item-text">
          <h3>Husmannskost</h3>
          <p>
            Vi er stolte over å ha et varierende tilbud av typisk norsk
            hjemmelaget kost
          </p>
          <Link className="cta-link" to="/">
            Husmannskost
          </Link>
        </div>
      </section>
      <section className="home-menu__item home-menu__item--right">
        <div className="home-menu__small-circle home-menu__small-circle--right"></div>
        <img src={pizzaImage} alt="pizza" />
        <div className="home-menu__item-text">
          <h3>Pizza</h3>
          <p>
            Vi har <em>kanskje</em> Norges beste pizza.
          </p>
          <Link className="cta-link" to="/">
            Pizzamenyen
          </Link>
        </div>
      </section>
      <section className="home-menu__item">
        <div className="home-menu__small-circle"></div>
        <img src={pizzaImage} alt="pizza" />
        <div className="home-menu__item-text">
          <h3>Kjøtt og Kebab</h3>
          <p>
            Vi har et godt utvalg av kjøtt og flere typer kebaber, både
            tradisjonelle og de mer lokalt tilpassede variantene..
          </p>
          <Link className="cta-link" to="/">
            Kjøtt
          </Link>
        </div>
      </section>
      <section className="home-menu__item home-menu__item--right">
        <div className="home-menu__small-circle home-menu__small-circle--right"></div>
        <img src={pizzaImage} alt="pizza" />
        <div className="home-menu__item-text">
          <h3>Barnemeny</h3>
          <p>
            Vi har en fin barnemeny og tilbyr mindre porsjoner av de fleste
            rettene vi har.
          </p>
          <Link className="cta-link" to="/">
            Barnemeny
          </Link>
        </div>
      </section>
      <Link className="button button-padded" to="/meny">
        Se maten vi lager
      </Link>
    </section>
  );
};
