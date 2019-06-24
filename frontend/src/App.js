import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom' 

import './App.css'
import AuthPage from './containers/Auth'
import BookingsPage from './containers/Bookings'
import EventsPage from './containers/Events'
import MainNavigation from './components/Navigation/MainNavigation'
import AuthContext from'./context/auth-context'

class App extends Component {

  state = {
    token: null,
    userID: null,
  }

  login = (token, userID, tokenExpiration) =>{
    this.setState({token: token, userID: userID})
  }

  logout = () => {
    this.setState({token: null, userID: null})
  }

  render () {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider 
            value={{
              token: this.state.token,
              userID: this.state.userID,
              login: this.login,
              logout: this.logout
            }}
          >
            <MainNavigation />
            <main className="main-content">
              <Switch>
                  {!this.state.token && <Redirect path='/' to='/auth' exact />}
                  {this.state.token && <Redirect path='/' to='/events' exact />}
                  {this.state.token && <Redirect path='/auth' to='/events' exact />}
           
                  {!this.state.token && <Route path='/auth' component={AuthPage} />}
                  <Route path='/events' component={EventsPage} />
                  {this.state.token && <Route path='/bookings' component={BookingsPage} />}
                </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

export default App;

