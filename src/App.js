import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import firebase from "./config/firebase";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { purple, green } from "@material-ui/core/colors";
import { CssBaseline } from "@material-ui/core";

import Login from "./components/Login/Login";
import Logout from "./components/Logout/Logout";
import Home from "./components/Home/Home";
import Admin from "./components/Admin/Admin";

const styles = {
  root: {
    width: "80%",
    // border: '1px solid lightgreen'
  }
};

const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: purple,
    secondary: green
  },
  status: {
    danger: "orange"
  },
  typography: {
    useNextVariants: true,
  },
});

class App extends Component {
  state = {
    authenticated: true
  };

  constructor(props) {
    super(props);
    firebase.auth().onAuthStateChanged(authenticated => {
      authenticated
        ? this.setState(() => ({ authenticated: true }))
        : this.setState(() => ({ authenticated: false }));
    });
  }

  render() {
    const { authenticated } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Grid container alignItems="center" justify="center">
          <div className={this.props.classes.root}>
            <a href="/">BackSlash</a>
            <div className="main-component">
              {authenticated ? (
                <div>
                  <a href="/admin">Admin</a> <Logout />
                </div>
              ) : (
                <a href="/login">Login!</a>
              )}
              <div className="routes">
                <Router>
                  <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/login" component={Login} />
                    <Route
                      path="/admin"
                      render={props => {
                        if (authenticated) {
                          return <Admin {...props} user={this.state.user} />;
                        } else {
                          return <Redirect to="/" />;
                        }
                      }}
                    />
                  </Switch>
                </Router>
              </div>
            </div>
          </div>
        </Grid>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
