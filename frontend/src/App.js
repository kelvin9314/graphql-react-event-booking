import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom' 

import './App.css'
import AuthPage from './containers/Auth'
import BookingsPage from './containers/Bookings'
import EventsPage from './containers/Events'
import MainNavigation from './components/Navigation/MainNavigation'

class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <React.Fragment>
          <MainNavigation />
          <main className="main-content">
            <Switch>
                <Redirect path='/' to='/auth' exact />
                <Route path='/auth' component={AuthPage} />
                <Route path='/events' component={EventsPage} />
                <Route path='/bookings' component={BookingsPage} />
              </Switch>
          </main>
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

export default App;

