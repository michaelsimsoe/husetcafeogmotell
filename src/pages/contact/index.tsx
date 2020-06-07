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

export const Contact: React.FunctionComponent = () => {
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
      <section className="contact-message col-sm-5 mt-5 mb-5 ml-md-5 p-5">
        <h3>Thank you, {formData.contactName}!</h3>
        <p>We'll give you a shout ASAP!</p>
      </section>
    );
  }
  return (
    <section className="contact-message col-sm-5 mt-5 mb-5 ml-md-5 p-5">
      <h3>Send us a message</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="contactName">Name</label>
          <input
            name="contactName"
            type="text"
            className="form-control"
            id="contactName"
            placeholder="Who goes there?"
            ref={register}
          />
          {errors.contactName && (
            <span id="contact-name-message">{errors.contactName.message}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="contactEmail">Email address</label>
          <input
            name="contactEmail"
            type="email"
            className="form-control"
            id="contactEmail"
            placeholder="So we can reply you"
            ref={register}
          />
          {errors.contactEmail && (
            <span id="contact-email-message">
              {errors.contactEmail.message}
            </span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="contactMessage">
            What do you want to tell us? Or ask us?
          </label>
          <textarea
            name="contactMessage"
            className="form-control"
            id="contactMessage"
            ref={register}
          ></textarea>
          {errors.contactMessage && (
            <span id="contact-message-message">
              {errors.contactMessage.message}
            </span>
          )}
        </div>
        <button
          id="contact-submit"
          type="submit"
          className="btn btn-primary cta-btn shadow"
        >
          Send Message
        </button>
      </form>
    </section>
  );
};
