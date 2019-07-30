import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from '../App';
import Home from './Home';
import NotFound from './NotFound';

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/home" component={Home} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default Router;
