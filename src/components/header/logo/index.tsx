import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';

import * as styles from './styles.module.scss';

interface LogoProps {
  setPos: Function;
  pos: number;
}
export const Logo: React.FC<LogoProps> = ({ setPos, pos }) => {
  // const [prevScrollpos, setPrevScrollpos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    window.addEventListener('scroll', throttle(handleScroll, 800));
    // return () => {
    //   window.removeEventListener('scroll', throttle(handleScroll, 800));
    // };
  }, [visible, pos]);

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    if (currentScrollPos < 250) return;
    setVisible(pos > currentScrollPos);
    setPos(currentScrollPos);
  };

  const throttle = (func: Function, limit = 100) => {
    let inThrottle: boolean;
    return function () {
      const args = arguments;
      const context: any = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };
  return (
    <Link to="/" className={`${styles.logo} ${!visible ? styles.hidden : ''}`}>
      <h1>michael krøyserth-simsø</h1>
      <h3>
        fullstack med en dæsj av <span>design</span>
      </h3>
    </Link>
  );
};
