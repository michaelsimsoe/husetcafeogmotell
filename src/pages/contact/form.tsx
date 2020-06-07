import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const encode = (data) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
};

const schema = yup.object().shape({
  contactName: yup.string().required('⚠ Please tell us you name'),
  contactEmail: yup
    .string()
    .email("⚠ This email address doesn't look right.")
    .required('⚠ Email is required'),
  contactMessage: yup
    .string()
    .min(
      3,
      '⚠ There must be something you want to say? What about a simple "hi"?'
    ),
});

export const ContactForm: React.FunctionComponent = () => {
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
      .then(() => alert('Success!'))
      .catch((error) => alert(error));
  };

  if (formData) {
    return (
      <section className="">
        <h3>Thank you, {formData.contactName}!</h3>
        <p>We'll give you a shout ASAP!</p>
      </section>
    );
  }
  return (
    <section className="contact-form">
      <h4>
        Send oss gjerne en e-post til{' '}
        <a href="mailto:kontakt@husetmotell.no">kontakt@husetmotell.no</a>.
        Eller benytt deg av skjemaet under.
      </h4>
      <form
        className="contact-form__form"
        name="contact"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="contact-form__form-group">
          <label htmlFor="contactName">Navn</label>
          <input
            name="contactName"
            type="text"
            className=""
            id="contactName"
            ref={register}
          />
          {errors.contactName && (
            <span id="contact-name-message">{errors.contactName.message}</span>
          )}
        </div>
        <div className="contact-form__form-group">
          <p>Hvordan vil du vi skal komme tilbake til deg?</p>
          <label htmlFor="contactEmail">E-post</label>
          <input
            name="contactEmail"
            type="email"
            className=""
            id="contactEmail"
            ref={register}
          />
          {errors.contactEmail && (
            <span id="contact-email-message">
              {errors.contactEmail.message}
            </span>
          )}
          <label htmlFor="contactPhone">Telefon</label>
          <input
            name="contactEmail"
            type="tel"
            className=""
            id="contactPhone"
            ref={register}
          />
          {errors.contactPhone && (
            <span id="contact-email-message">
              {errors.contactPhone.message}
            </span>
          )}
        </div>
        <div className="contact-form__form-group">
          <label htmlFor="contactMessage">Melding</label>
          <textarea
            name="contactMessage"
            className=""
            id="contactMessage"
            ref={register}
            rows={4}
          ></textarea>
          {errors.contactMessage && (
            <span id="contact-message-message">
              {errors.contactMessage.message}
            </span>
          )}
        </div>
        <button id="contact-submit" type="submit" className="button">
          Send Melding
        </button>
      </form>
    </section>
  );
};
