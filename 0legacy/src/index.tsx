import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import ReactDOM from 'react-dom';
// import * as Sentry from '@sentry/browser';
// import LogRocket from 'logrocket';

import './scss/index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

import './i18n';
import { Loader } from './components/loader';
import { ScrollToTop } from './components/scrollToTop';
// LogRocket.init('5dnnsg/huset-cafe-motell');
// Sentry.init({
//   dsn:
//     'https://8574f622b8474a3e9917ba8b7124c64f@o386905.ingest.sentry.io/5221674',
// });
// LogRocket.getSessionURL((sessionURL) => {
//   Sentry.configureScope((scope) => {
//     scope.setExtra('sessionURL', sessionURL);
//   });
// });

ReactDOM.render(
  <Suspense fallback={<Loader logoColor="#fff" />}>
    <React.StrictMode>
      <Router>
        <ScrollToTop />
        <App />
      </Router>
    </React.StrictMode>
  </Suspense>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
