import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';

import { useTracking } from './hooks/useTracking';

import { Home } from './pages/home';
import { Navigation } from './components/navigation';
import { Rooms } from './pages/rooms';
import { Menu } from './pages/menu';
import { Events } from './pages/events';
import { Contact } from './pages/contact';

const App: React.FunctionComponent = () => {
  let location = useLocation();
  console.log(location);
  return (
    <>
      <Navigation open={false} />
      <Switch>
        <Route exact path="/">
          <Home />
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
    </>
  );
};

export default App;
