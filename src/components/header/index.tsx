import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';

import * as styles from './styles.module.scss';
import { Logo } from './logo';
import { Navigation } from './navigation';

export const Header: React.FC = () => {
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [prevScrollpos, setPrevScrollpos] = useState(0);
  // useEffect(() => {}, [prevScrollpos]);
  return (
    <header
      className={`${styles.header} ${styles.wrapper} ${
        openSidebar ? styles.open : ''
      }`}
    >
      <Logo pos={prevScrollpos} setPos={setPrevScrollpos} />
      <div
        className={`${styles.hamburger} ${openSidebar ? styles.open : ''}`}
        id="menu"
        role="button"
        tabIndex={0}
        onClick={() => {
          setOpenSidebar(!openSidebar);
        }}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      <Navigation
        openSidebar={openSidebar}
        closeSidebar={() => {
          setOpenSidebar(false);
        }}
      />
    </header>
  );
};
