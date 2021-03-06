import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Transformation } from 'cloudinary-react';

export const RoomsContainer: React.FunctionComponent = () => {
  const { t } = useTranslation(['translation', 'rooms']);
  return (
    <section className="rooms-info">
      <section className="rooms-intro">
        <h2 className="section-heading">{t('rooms:rooms-section')}</h2>
        <div className="rooms-intro__container">
          <figure className="image-carousel">
            <Image
              cloudName="huset-cafe-og-motell"
              publicId="rom/skrivebord_r60crq.webp"
              crop="scale"
              alt="skrivebord på rom"
            >
              <Transformation fetchFormat="auto" crop="scale" />
              <Transformation width="auto" dpr="auto" crop="scale" />
            </Image>
          </figure>
          <div className="rooms-intro__info">
            <div className="info-container__content">
              <div className="info-container">
                <h3>{t('rooms:rooms-cozy')}</h3>
                <p>{t('rooms:rooms-cozy-text')}</p>
              </div>
              <div className="info-container">
                <h3>{t('rooms:rooms-bath')}</h3>
                <p>{t('rooms:rooms-bath-text')}</p>
              </div>
            </div>
            <div className="info-container">
              <h3>{t('rooms:rooms-home')}</h3>
              <p>{t('rooms:rooms-home-text')}</p>
            </div>
          </div>
        </div>
      </section>
      <div className="rooms-wrapper">
        <section className="rooms double-rooms">
          <h2 className="section-heading section-heading--first">
            {t('rooms:double')}
          </h2>
          <div className="double-rooms__container">
            <figure className="double-rooms__image">
              <Image
                cloudName="huset-cafe-og-motell"
                publicId="rom/rom_to_yzolnv.webp"
                crop="scale"
                alt="dobbeltrom"
              >
                <Transformation fetchFormat="auto" crop="scale" />
                <Transformation width="auto" dpr="auto" crop="scale" />
              </Image>
            </figure>
            <div className="info-container">
              <h3>{t('rooms:double-size')}</h3>
              <p>{t('rooms:double-text')}</p>
              <div className="info-container__price">
                <p>{t('rooms:double-price')}</p>
                <p>{t('rooms:double-breakfast')}</p>
              </div>
            </div>
          </div>
        </section>
        <section className="rooms single-rooms">
          <h2 className="section-heading">{t('rooms:single')}</h2>
          <div className="single-rooms__container">
            <figure className="single-rooms__image">
              <Image
                cloudName="huset-cafe-og-motell"
                publicId="rom/rom_en_ipd88c.webp"
                crop="scale"
                alt="enkeltrom"
              >
                <Transformation fetchFormat="auto" crop="scale" />
                <Transformation width="auto" dpr="auto" crop="scale" />
              </Image>
            </figure>
            <div className="info-container">
              <h3>{t('rooms:single-size')}</h3>
              <p>{t('rooms:single-text')}</p>
              <div className="info-container__price">
                <p>{t('rooms:single-price')}</p>
                <p>{t('rooms:single-breakfast')}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <section className="rooms breakfast full-width">
        <h2 className="section-heading">{t('rooms:breakfast')}</h2>
        <div className="full-width__container">
          <figure className="full-width__figure">
            <div className="img__overlay"></div>
            <Image
              cloudName="huset-cafe-og-motell"
              publicId="rom/frokost-placeholder_aixosv"
              alt="frokostbord"
            >
              <Transformation fetchFormat="auto" crop="scale" />
              <Transformation width="auto" dpr="auto" crop="scale" />
            </Image>
          </figure>
          <div className="full-width__content">
            <h3>{t('rooms:breakfast-sub')}</h3>
            <p>{t('rooms:breakfast-text')}</p>
          </div>
        </div>
      </section>
      <section className="rooms information">
        <div className="info-container">
          <h3>Huset Café & Motell</h3>
          <p>{t('rooms:house-text')}</p>
        </div>
        <div className="info-container">
          <h3>{t('rooms:house-rules')}</h3>
          <p>{t('rooms:house-rules-text1')}</p>
          <p>{t('rooms:house-rules-text2')}</p>
          <p>{t('rooms:house-rules-text3')}</p>
        </div>
        <div className="info-container info-container__area">
          <h3>{t('rooms:surroundings')}</h3>
          <p>{t('rooms:surroundings-text')}</p>
          <h4>{t('rooms:center')}</h4>
          <p>{t('rooms:center-text')}</p>
          <a href="https://www.facebook.com/pages/category/Shopping---Retail/Korgensenteret-808018572706977/">
            {t('rooms:center-link')}
          </a>
          <h4>{t('rooms:gas')}</h4>
          <p>{t('rooms:gas-text')}</p>
          <a href="https://www.facebook.com/circlekkorgen/posts/309648532524260/">
            {t('rooms:gas-link')}
          </a>
          <h4>{t('rooms:mun')}</h4>
          <p>{t('rooms:mun-text')}</p>
          <a href="https://www.hemnes.kommune.no/">{t('rooms:mun-link')}</a>
          <h4>{t('rooms:oks')}</h4>
          <p>{t('rooms:oks-text')}</p>
          <a href="https://visitokstindan.com/">{t('rooms:oks-link')}</a>
        </div>
      </section>
    </section>
  );
};
