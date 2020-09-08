import React, { useEffect, useState } from 'react';
import { Header } from '../header';
import { Footer } from '../footer';

import * as styles from './styles.module.scss';

interface Props {
  location: Location;
  title: string;
  children?: any;
}

const Layout: React.FC<Props> = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`;
  let header;

  // if (location.pathname === rootPath) {

  return (
    <div>
      <Header />
      <main
        className={`${styles.wrapper} ${
          location.pathname === rootPath
            ? styles.wrapper_root
            : styles.wrapper_article
        }`}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
