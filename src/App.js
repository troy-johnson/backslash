import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import firebase from "./config/firebase";
import Login from "./components/Login/Login";
import Logout from "./components/Logout/Logout"
import Home from "./components/Home/Home";
import Admin from "./components/Admin/Admin";

const styles = {
  root: {
    backgroundColor: "green",
    color: "white"
  }
};

const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

class App extends Component {
  state = {
    authenticated: false
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(authenticated => {
      console.log('onAuthStateChange authenticated', authenticated);
      authenticated ? this.setState(() => ({ authenticated: true })) : this.setState(() => ({ authenticated: false }));
    });
  }

  render() {
    const { authenticated } = this.state;

    return (
      <div className={this.props.classes.root}>
        <a href="/">BackSlash</a>
        <div className="main-component">
          { authenticated ? <div><a href="/admin">Admin</a> <Logout /></div> : <a href="/login">Login!</a>}
          <div className="routes">
            <Router>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/login" component={Login} />
                {/* <Route exact path="/admin" component={Admin} /> */}
                <Route exact path="/admin" render={()=><Admin authenticated={authenticated}/>}/>
              </Switch>
            </Router>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(App);
