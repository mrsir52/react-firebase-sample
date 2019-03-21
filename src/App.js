import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import firebase, { auth, provider } from "./firebase";
import LogHours from "./LogHours"


class App extends Component {
  constructor() {
    super();
    this.state = {
      hoursWorked: "",
      username: "",
      items: [],
      user: null
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  logout() {
    auth.signOut().then(() => {
      this.setState({
        user: null
      });
    });
  }

  login() {
    auth.signInWithPopup(provider).then(result => {
      const user = result.user;
      this.setState({
        user
      });
    });
  }
  handleSubmit = e => {
    e.preventDefault();
    const itemsRef = firebase.database().ref("items");
    const item = {
      title: this.state.hoursWorked,
      // user: this.state.user.displayName || this.state.user.email
    };
    itemsRef.push(item);
    this.setState({
      hoursWorked: "",
      username: ""
    });
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      }
    });

    const itemsRef = firebase.database().ref("items");
    itemsRef.on("value", snapshot => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user
        });
      }
      this.setState({
        items: newState
      });
    });
  }

  removeItem = itemId => {
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();
  };
  render() {
    console.log(this.state.user);
    return (
      <div className="app">
        <header>
          <div className="wrapper">
            <h1>Time Card</h1>
            {this.state.user ? (
              <button onClick={this.logout}>Logout</button>
            ) : (
              <button onClick={this.login}>Log In</button>
            )}
          </div>
        </header>
        {this.state.user ? (
          <div>
            <div className="user-profile">
              {/* <img src={this.state.user.photoURL} /> */}
            </div>
          </div>
        ) : (
          <div className="wrapper">
            <p>
              You must be logged in to see the potluck list and submit to it.
            </p>
          </div>
        )}

        {/* Start of form */}
        {this.state.user ?
          <div>
            <ul className="nav">
  <li className="nav-item">
    <a className="nav-link active" href="#">Log Hours</a>
  </li>
  <li className="nav-item">
    <a className="nav-link" href="#">View Previous</a>
  </li>
  <li className="nav-item">
    <a className="nav-link" href="#">Link</a>
  </li>
  <img src={this.state.user.photoURL} height="50px"/>
</ul>
<LogHours />
            
            
          </div>
        : 
          <p>You must be logged in to see the potluck list and submit to it.</p>
        }
        
      </div>
    );
  }
}

export default App;
