import React from 'react';
import { Link } from 'gatsby';

import * as styles from './styles.module.scss';

export const Footer: React.FC = () => {
  return (
    <footer className={`${styles.footer} ${styles.wrapper}`}>
      <div className={styles.footer__container}>
        <section className={styles.footer__primary}>
          <p>
            Jeg heter Michael Krøyserth-Simsø. Jeg en fullstackutvikler med
            hovedfokus på frontend. Holder til i Tromsø. Jobber helst med
            Javascript, en del med Ruby og Ruby on Rails og litt .Net. Har en
            forkjærlighet for design og interaksjonsdesign. Synes i all
            hemmelighet at DevOps er spennende.
          </p>
        </section>
        <section className={styles.footer__secondary}>
          <div className={styles.social}>
            <a href="https://github.com/michaelsimsoe" className="github-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32.58 31.77">
                <title>github</title>
                <g id="Layer_2" data-name="Layer 2">
                  <g id="Layer_1-2" data-name="Layer 1">
                    <path
                      className={styles.cls_1}
                      d="M16.29,0a16.29,16.29,0,0,0-5.15,31.75c.82.15,1.11-.36,1.11-.79s0-1.41,0-2.77C7.7,29.18,6.74,26,6.74,26a4.36,4.36,0,0,0-1.81-2.39c-1.47-1,.12-1,.12-1a3.43,3.43,0,0,1,2.49,1.68,3.48,3.48,0,0,0,4.74,1.36,3.46,3.46,0,0,1,1-2.18c-3.62-.41-7.42-1.81-7.42-8a6.3,6.3,0,0,1,1.67-4.37,5.94,5.94,0,0,1,.16-4.31s1.37-.44,4.48,1.67a15.41,15.41,0,0,1,8.16,0c3.11-2.11,4.47-1.67,4.47-1.67A5.91,5.91,0,0,1,25,11.07a6.3,6.3,0,0,1,1.67,4.37c0,6.26-3.81,7.63-7.44,8a3.85,3.85,0,0,1,1.11,3c0,2.18,0,3.94,0,4.47s.29.94,1.12.78A16.29,16.29,0,0,0,16.29,0Z"
                    />
                  </g>
                </g>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/michaelsimsoe"
              className={styles.linkedin_link}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 611.86 173.97"
              >
                <title>Linkedin logo</title>
                <g id="Layer_2" data-name="Layer 2">
                  <g id="Layer_1-2" data-name="Layer 1">
                    <path
                      className={styles.outline}
                      d="M611.86,156.58A17.36,17.36,0,0,1,594.53,174H457.26a17.36,17.36,0,0,1-17.33-17.39V17.39A17.36,17.36,0,0,1,457.26,0H594.53a17.36,17.36,0,0,1,17.33,17.39Z"
                    />
                    <g>
                      <path
                        className={styles.inline}
                        d="M0,35.08H23.13v83.09H63.92v19.48H0Z"
                      />
                      <path
                        className={styles.inline}
                        d="M96,42.54C96,48.93,91.3,54.1,83.54,54.1c-7.3,0-12-5.17-12-11.56C71.52,36,76.39,31,83.85,31S95.87,36,96,42.54ZM72.13,137.65V63.23H95.26v74.42Z"
                      />
                      <path
                        className={styles.inline}
                        d="M109.1,87c0-9.28-.3-17-.6-23.74h20.08l1.07,10.35h.46c3-4.87,10.5-12,23-12,15.21,0,26.63,10.2,26.63,32.11v44H156.59V96.41c0-9.59-3.35-16.13-11.72-16.13-6.39,0-10.2,4.41-11.87,8.67a16.67,16.67,0,0,0-.76,5.79v42.91H109.1Z"
                      />
                      <path
                        className={styles.inline}
                        d="M216.69,94.58H217a97.44,97.44,0,0,1,5.33-9l15.06-22.38h27.85L238.61,93.37l30.44,44.28H240.59l-18.11-30.59-5.79,7.31v23.28H193.56V29.6h23.13Z"
                      />
                      <path
                        className={styles.inline}
                        d="M287,107.82c.61,9.59,10.2,14.16,21,14.16a61.32,61.32,0,0,0,20.55-3.2l3,15.68c-7.61,3.19-16.89,4.71-26.93,4.71-25.27,0-39.73-14.6-39.73-37.89,0-18.87,11.72-39.72,37.59-39.72,24.05,0,33.18,18.72,33.18,37.13a55.37,55.37,0,0,1-.76,9.13ZM314.24,92c0-5.63-2.43-15.07-13.09-15.07-9.74,0-13.69,9-14.3,15.07Z"
                      />
                      <path
                        className={styles.inline}
                        d="M417,29.6v85.83c0,8.37.31,17.2.61,22.22H397l-.91-10.8h-.45c-4.57,8.21-13.7,12.48-23.29,12.48-17.65,0-31.81-15.07-31.81-38.2-.15-25.11,15.53-39.72,33.33-39.72,9.29,0,16.29,3.35,19.63,8.37h.31V29.6ZM393.83,94.74a20.52,20.52,0,0,0-.31-4.27c-1.36-6.08-6.39-11.26-13.54-11.26-10.65,0-16,9.44-16,21.16,0,12.63,6.24,20.54,15.83,20.54a13.7,13.7,0,0,0,13.54-11.11,29.59,29.59,0,0,0,.46-5.32Z"
                      />
                    </g>
                    <g>
                      <path
                        className={styles.inline}
                        d="M495.86,42.54c0,6.39-4.72,11.56-12.48,11.56-7.3,0-12-5.17-12-11.56C471.36,36,476.23,31,483.68,31S495.71,36,495.86,42.54ZM472,137.65V63.23H495.1v74.42Z"
                      />
                      <path
                        className={styles.inline}
                        d="M508.94,87c0-9.28-.3-17-.6-23.74h20.08l1.07,10.35H530c3-4.87,10.5-12,23-12,15.21,0,26.63,10.2,26.63,32.11v44H556.43V96.41c0-9.59-3.35-16.13-11.72-16.13-6.4,0-10.2,4.41-11.87,8.67a16.65,16.65,0,0,0-.77,5.79v42.91H508.94Z"
                      />
                    </g>
                  </g>
                </g>
              </svg>
            </a>
          </div>
          <div className={styles.contact}></div>
        </section>
      </div>
    </footer>
  );
};
