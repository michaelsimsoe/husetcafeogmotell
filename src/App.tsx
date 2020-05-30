import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';

import { useTracking } from './hooks/useTracking';

import { Home } from './pages/home';
import { Navigation } from './components/navigation';
import { Rooms } from './pages/rooms';
import { Menu } from './pages/menu';
import { Events } from './pages/events';
import { Contact } from './pages/contact';
import { Footer } from './components/footer';

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
          <Rooms />
        </Route>
        <Route exact path="/meny">
          <Menu />
        </Route>
        <Route exact path="/arrangementer">
          <Events />
        </Route>
        <Route exact path="/tjenester">
          <Events />
        </Route>
        <Route exact path="/kontakt">
          <Contact />
        </Route>
      </Switch>
      <Footer />
    </>
  );
};

export default App;
