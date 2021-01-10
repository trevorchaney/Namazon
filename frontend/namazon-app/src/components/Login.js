import React from 'react';
import axios from 'axios';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: "login",
      isLoggedIn: false,
      firstName: "",
      lastName: "",
      email: "",
      login: "",
      password: "",
      token: "",
      userID: "",
      cartID: "",
      newUserMessage: false,
    }

    this.initState = this.state;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.postUserLogin = this.postUserLogin.bind(this);
  }

  async postUserLogin(event) {
    try {
      const url = this.props.dataBlob.baseURL + "/user/login";
      const loginBody = {
        login: this.state.login,
        password: this.state.password
      }
      const response = await axios.post(url, loginBody);
      console.log(response);
      if(response.status === 200) {
        this.setState({isLoggedIn: true});
      }
      console.log("The response was : ", response.data);
      this.setState({
        firstName: response.data.user.firstName,
        lastName: response.data.user.lastName,
        email: response.data.user.email,
        token: response.data.accessToken,
        userID: response.data.user._id,
        cartID: response.data.user.cart,
      })
      this.props.updateStateObject(this.state);
    } catch(e) {
      console.log("Error in post to login: ", e);
    }

    event.preventDefault();
  }

  async postNewUser(event) {
    try {
      const url = this.props.dataBlob.baseURL + "/user";
      const loginBody = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        login: this.state.login,
        password: this.state.password
      }
      const response = (await axios.post(url, loginBody)).data;
      console.log("The response for new user was : ", response);
    } catch(e) {
      console.log("Error in post to login: ", e);
    }

    event.preventDefault();
  }

  handleChange = (event) => {
    event.preventDefault();
    this.newUserMessage = false;
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    try {
      if(this.state.selectedOption === "login") {
        this.postUserLogin(event);
      } else if(this.state.selectedOption === "register") {
        this.newUserMessage = true;
      } else {
        console.log("Failure in login, handleSubmit");
      }
    } catch(e) {
      console.log("Error: ", e);
    } finally {
      console.log("YOU MADE IT THIS FAR");
      this.props.updateStateObject(this.state);
    }
    event.preventDefault();
  }

  handleLogoutClick = (event) => {
    event.preventDefault();
    this.setState(this.initState);
    this.props.updateStateObject(this.initState);
  }

  render() {
    return (
      <div className="LoginComponent">
        {this.state.isLoggedIn === true &&
          <div>
            <h1>Hello, {this.props.dataBlob.login}</h1>
            <button onClick={this.handleLogoutClick} type="button">Logout</button>
          </div>
        }
        {this.state.isLoggedIn === false &&
          <div>
            <h1>Welcome to Namazon</h1>
            <p>
              If you are a new user, please create an account by selecting "Sign-up" below.
            </p>
  
            <form onSubmit={this.handleSubmit}>
              {this.state.selectedOption === "login" &&
                <section>
                <label>
                  Username:
                  <input type="text" name="login" onChange={this.handleChange} />
                </label>
                <br />
                <label>
                  Password:
                  <input type="text" name="password" onChange={this.handleChange} />
                </label>
                </section>
              }
              {this.state.selectedOption === "register" &&
              <section>
                <label>
                  FirstName:
                  <input type="text" name="firstName" onChange={this.handleChange} />
                </label>
                <br />
                <label>
                  LastName:
                  <input type="text" name="lastName" onChange={this.handleChange} />
                </label>
                <br />
                <label>
                  Email:
                  <input type="text" name="email" onChange={this.handleChange} />
                </label>
                <br />
                <label>
                  Username:
                  <input type="text" name="login" onChange={this.handleChange} />
                </label>
                <br />
                <label>
                  Password:
                  <input type="text" name="password" onChange={this.handleChange} />
                </label>
              </section>
              }
              {this.newUserMessage === true &&
                  <p>Your new account has been created. Please select the login option and then enter your account username and password.</p>
              }
              <br/>
              <label>
                <input
                  type="radio"
                  name="selectedOption"
                  value="login"
                  onChange={this.handleChange}
                  defaultChecked
                />
                Login

                <input
                  type="radio"
                  name="selectedOption"
                  value="register"
                  onChange={this.handleChange}
                />
                Sign-up
              </label>
              <input type="submit" value="Submit" onSubmit={this.handleSubmit} />
            </form>
          </div>
        }
      </div>
    );
  }
}

export default Login
