import React from 'react';
import Image from 'gatsby-image';
import { useStaticQuery, graphql } from 'gatsby';

import * as styles from './styles.module.scss';
import head from './michaelsimso.svg';

export const Intro: React.FC = () => {
  return (
    <section className={styles.intro}>
      <div className={styles.head}>
        <img src={head} alt="" />
      </div>
      <div className={styles.heart}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56.47 49.9">
          <g id="Layer_2" data-name="Layer 2">
            <g id="Layer_1-2" data-name="Layer 1">
              <g id="Group_17" data-name="Group 17">
                <g id="Union_3" data-name="Union 3">
                  <path
                    className={styles.heart}
                    d="M52 25.23l-.18.17-23.93 23.09-.2-.2-.2.19L4.23 24.42l-.15-.17a12.41 12.41 0 01-3-9.36A15.38 15.38 0 0115.39 1a12.43 12.43 0 019.26 3.35l.17.17.18.18 2.69 2.78.69.72.72-.69 3-2.86.17-.16a12.45 12.45 0 019.37-3 15 15 0 019.58 4.62 15 15 0 014.29 9.73 12.4 12.4 0 01-3.35 9.25z"
                  />
                  <path
                    className={styles.heart}
                    d="M51.24 24.53l.15-.16a11.41 11.41 0 003.07-8.52 14 14 0 00-4-9.08 14 14 0 00-8.94-4.31 11.43 11.43 0 00-8.62 2.78l-.16.14-2.95 2.85-1.44 1.39L27 8.18l-2.73-2.79-.16-.15-.11-.15A11.47 11.47 0 0015.44 2a14 14 0 00-9.08 4A14 14 0 002 15a11.43 11.43 0 002.78 8.62l.15.16 22.58 23.29.21-.2.19.21 23.17-22.4.16-.15m1.6 1.23l-.37.36L27.86 49.9l-.19-.2-.21.2-24.14-25C-1.66 19.32-1 10.33 5 4.58s15-6.12 20.37-.94l.36.37 2.67 2.78 3.15-3c5.59-5 14.58-4.3 20.33 1.64s6.12 15 .94 20.37z"
                  />
                </g>
                <g id="Page-1">
                  <g id="Dribbble-Light-Preview">
                    <g id="icons">
                      <path
                        id="javascript-"
                        d="M33.26 31.92A3.6 3.6 0 0129.84 30l1.53-.89a2 2 0 001.85 1.14c.78 0 1.28-.39 1.28-.92 0-.81-1.08-1.13-1.84-1.45-1.36-.58-2.26-1.3-2.26-2.88a2.51 2.51 0 012.53-2.49h.22a2.77 2.77 0 012.67 1.5l-1.46.99a1.28 1.28 0 00-1.21-.8.8.8 0 00-.89.73.17.17 0 000 .07c0 .57.35.79 1.16 1.14 1.69.73 3 1.3 3 3.16 0 1.69-1.33 2.62-3.12 2.62zm-4.33-2.83a2.7 2.7 0 01-2.41 3 2.26 2.26 0 01-.45 0 2.77 2.77 0 01-2.85-1.57l1.53-1.07c.3.52.56.89 1.2.89s1-.31 1-1.25v-6.6h2v6.6zm-11 4.4h20v-20h-20z"
                        fill="#931939"
                        fillRule="evenodd"
                      />
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </section>
  );
};
