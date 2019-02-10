import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  // Redirect
} from "react-router-dom";

import firebase from "./config/firebase";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { darkBlue, teal, darkRed } from "@material-ui/core/colors";
import { CssBaseline } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
// import withWidth from "@material-ui/core/withWidth";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import LockIcon from "@material-ui/icons/Lock";
import EventIcon from "@material-ui/icons/Event";
import GroupIcon from "@material-ui/icons/Group";

import Login from "./components/Login/Login";
import Logout from "./components/Logout/Logout";
import Home from "./components/Home/Home";
import Admin from "./components/Admin/Admin";
import Roster from "./components/Roster/Roster";

const styles = {
  root: {},
  routes: {
    marginBottom: '60px'
  },
  stickToBottom: {
    width: "100%",
    position: "fixed",
    bottom: 0
  }
};

const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: teal,
    secondary: darkBlue,
    error: darkRed
  },
  status: {
    danger: "orange"
  },
  typography: {
    useNextVariants: true
  }
});

class App extends Component {
  state = {
    authenticated: true,
    value: 0
  };

  constructor(props) {
    super(props);
    firebase.auth().onAuthStateChanged(authenticated => {
      authenticated
        ? this.setState(() => ({ authenticated: true }))
        : this.setState(() => ({ authenticated: false }));
    });
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { authenticated, value } = this.state;
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Grid container alignItems="center" justify="center">
          <div className={classes.root}>
            <a href="/">BackSlash</a>
            <div className="main-component">
              {authenticated ? (
                <div>
                  <a href="/admin">Admin</a> <Logout />
                </div>
              ) : (
                <Login />
              )}
              <div className={classes.routes}>
                <Router>
                  <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/roster" component={Roster} />
                    <Route path="/login" component={Login} />
                    <Route
                      path="/admin"
                      render={props => {
                        if (authenticated) {
                          return <Admin {...props} user={this.state.user} />;
                        } else {
                          return <Login />;
                        }
                      }}
                    />
                  </Switch>
                </Router>
              </div>
              <div>
                <Hidden smUp>
                  <BottomNavigation
                    className={classes.stickToBottom}
                    value={value}
                    onChange={this.handleChange}
                    showLabels
                  >
                    <BottomNavigationAction 
                      label="Next Game" 
                      icon={<EventIcon />} />
                    <BottomNavigationAction
                      label="Roster"
                      icon={<GroupIcon />} />
                    <BottomNavigationAction
                      label="Admin"
                      icon={<LockIcon />} />
                  </BottomNavigation>
                </Hidden>
              </div>
            </div>
          </div>
        </Grid>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
