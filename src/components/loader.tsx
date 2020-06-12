import React from 'react';
import { Logo } from './logo';

interface LoaderProps {
  height?: string | '100vh';
  logoColor?: string | '#fff';
}

export const Loader: React.FunctionComponent<LoaderProps> = (props) => {
  return (
    <div className="loader" style={{ height: props.height }}>
      <div className="loader__logo">
        <Logo color={props.logoColor} />
      </div>
      <div className="dots">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
