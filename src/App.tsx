import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Home } from './pages/home';
import { Navigation } from './components/navigation';
import { Rooms } from './pages/rooms';
import { Menu } from './pages/menu';
import { Events } from './pages/events';
import { Contact } from './pages/contact';

const App: React.FunctionComponent = () => {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
