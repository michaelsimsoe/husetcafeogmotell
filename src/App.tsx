import React, { Suspense, useState, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';

import { useTracking } from './hooks/useTracking';

import { Home } from './pages/home';
import { Contact } from './pages/contact';
import { Navigation } from './components/navigation';
import { Loader } from './components/loader';
import { Footer } from './components/footer';

const Rooms = lazy(() => import('./pages/rooms'));
const Events = lazy(() => import('./pages/events'));
const Menu = lazy(() => import('./pages/menu'));

const App: React.FunctionComponent = () => {
  const [sidebarOpen, toggleSidebar] = useState<boolean>(false);
  useTracking();

  return (
    <>
      <Navigation open={sidebarOpen} />
      <Switch>
        <Route exact path="/">
          <Home sidebarOpen={toggleSidebar} />
        </Route>
        <Route exact path="/overnatting">
          <Suspense fallback={<Loader />}>
            <Rooms sidebarOpen={toggleSidebar} />
          </Suspense>
        </Route>
        <Route exact path="/meny">
          <Suspense fallback={<Loader />}>
            <Menu sidebarOpen={toggleSidebar} />
          </Suspense>
        </Route>
        <Route exact path="/arrangementer">
          <Suspense fallback={<Loader />}>
            <Events sidebarOpen={toggleSidebar} />
          </Suspense>
        </Route>
        <Route exact path="/tjenester">
          <Suspense fallback={<Loader />}>
            <Events sidebarOpen={toggleSidebar} />
          </Suspense>
        </Route>
        <Route exact path="/kontakt">
          <Contact sidebarOpen={toggleSidebar} />
        </Route>
      </Switch>
      <Footer />
    </>
  );
};

export default App;
