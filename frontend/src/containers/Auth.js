import React, { Component } from "react";

import '../styles/Auth.css'
import AuthContext from '../context/auth-context'

class AuthPage extends Component {

  state = {
    isLogin: true
  }

  static contextType = AuthContext
  
  constructor(props){
    super(props);
    this.emailEL = React.createRef();
    this.passwordEL = React.createRef();
  }

  handleSubmit = event => {
    // 取消點擊動作的默認導航行為
    event.preventDefault()
    const email = this.emailEL.current.value;
    const password = this.passwordEL.current.value;

    if(email.trim().length === 0 || password.trim().length === 0 ) return
    
    // Login
    let requestBody = {
      query: `
        query {
          login(email: "${email}",password: "${password}") {
            userID
            token
            tokenExpiration
          }
        }
      `
    }

    // Signup
    if (!this.state.isLogin) {
       requestBody = {
        query: `
          mutation {
            createUser(userInput: {email: "${email}", password: "${password}"}){
              _id
              email
            }
          }
        `
      };
    }

    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if(res.status !== 200 && res.status !== 201){
        throw new Error('Failed!')
      }
      return res.json()
    })
    .then(resData => {
      if(resData.data.login.token) {
        const {token, userID, tokenExpiration} = resData.data.login
        this.context.login(token, userID, tokenExpiration)
      }
    })
    .catch(err => {
      console.log(err);
    })
  };
  
  handleSwitchModel = () => {
    this.setState(prevState => {
      return {isLogin: !prevState.isLogin}
    })
  }

  render() {
    return (
      <form className="auth-form" onSubmit={this.handleSubmit}>
        <div className="form-control">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email"ref={this.emailEL} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordEL} />
        </div>
        <div className="form-actions">
          <button type="submit">
            Submit
          </button>
          <button type="button" onClick={this.handleSwitchModel} >
            Switch to {this.state.isLogin ? 'Signup' : 'Login'}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;