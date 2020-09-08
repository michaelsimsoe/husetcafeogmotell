import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const encode = (data) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
};

const schema = yup.object().shape({
  contactName: yup.string().required(),
  contactEmail: yup.string().email(),
  contactPhone: yup.string().notRequired(),
  contactMessage: yup.string().min(3),
});

export const ContactForm: React.FunctionComponent = () => {
  const { t } = useTranslation(['translation', 'contact']);
  const [formData, setFormData] = useState(null);
  const { register, handleSubmit, errors } = useForm({
    validationSchema: schema,
  });
  const onSubmit = (data) => {
    setFormData(data);
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({ 'form-name': 'contact', ...data }),
    })
      .then(() => console.log('Message sent'))
      .catch((error) => console.log(error));
  };

  if (formData) {
    return (
      <section className="contact__fedback">
        <h3>
          {t('contact:feedback-thank')}, {formData.contactName}!
        </h3>
        <p>{t('contact:feedback')}</p>
      </section>
    );
  }
  return (
    <section className="contact-form">
      <h4>
        {t('contact:contact-email1')}{' '}
        <a href="mailto:kontakt@husetmotell.no">kontakt@husetmotell.no</a>.{' '}
        <br />
        {t('contact:contact-email2')}
      </h4>
      <form
        className="contact-form__form"
        name="contact"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="contact-form__form-group">
          <label htmlFor="contactName">{t('contact:field-name')}</label>
          <input
            name="contactName"
            type="text"
            className={
              errors.contactName
                ? 'contact-form__field contact-form__field--error'
                : 'contact-form__field'
            }
            id="contactName"
            ref={register}
          />
          {errors.contactName && (
            <span id="contact-name-message">
              <span>⚠ </span>
              {t('contact:error-name')}
            </span>
          )}
        </div>
        <div className="contact-form__form-group">
          <p>{t('contact:contact-back')}</p>
          <label htmlFor="contactEmail">{t('contact:field-email')}</label>
          <input
            name="contactEmail"
            type="email"
            className={
              errors.contactEmail
                ? 'contact-form__field contact-form__field--error'
                : 'contact-form__field'
            }
            id="contactEmail"
            ref={register}
          />
          <label htmlFor="contactPhone">{t('contact:field-phone')}</label>
          <input
            name="contactPhone"
            type="tel"
            className={
              errors.contactPhone
                ? 'contact-form__field contact-form__field--error'
                : 'contact-form__field'
            }
            id="contactPhone"
            ref={register}
          />
        </div>
        <div className="contact-form__form-group">
          <label htmlFor="contactMessage">{t('contact:field-message')}</label>
          <textarea
            name="contactMessage"
            className={
              errors.contactMessage
                ? 'contact-form__field contact-form__field--error'
                : 'contact-form__field'
            }
            id="contactMessage"
            ref={register}
            rows={4}
          ></textarea>
          {errors.contactMessage && (
            <span id="contact-message-message">
              <span>⚠ </span>
              {t('contact:error-message')}
            </span>
          )}
        </div>
        <button id="contact-submit" type="submit" className="button">
          {t('contact:form-button')}
        </button>
      </form>
    </section>
  );
};
