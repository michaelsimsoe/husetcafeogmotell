import React from 'react';
import { Link } from 'gatsby';

import * as styles from './styles.module.scss';

interface NavigationProps {
  openSidebar: boolean;
  closeSidebar: Function;
}
export const Navigation: React.FC<NavigationProps> = ({
  openSidebar,
  closeSidebar,
}) => {
  return (
    <div className={`${styles.nav} ${openSidebar ? styles.open : ''}`}>
      <Link
        onClick={() => {
          closeSidebar();
        }}
        activeClassName={styles.active}
        to="/"
      >
        Hjem
      </Link>
      {/* <Link
        onClick={() => {
          closeSidebar();
        }}
        activeClassName={styles.active}
        to="/om"
      >
        Om meg
      </Link>
      <Link
        onClick={() => {
          closeSidebar();
        }}
        activeClassName={styles.active}
        to="/artikler"
      >
        Artikler
      </Link> */}
    </div>
  );
};
