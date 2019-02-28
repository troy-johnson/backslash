import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch
  // Redirect
} from "react-router-dom";

import firebase from "./config/firebase";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { indigo, teal, darkRed } from "@material-ui/core/colors";
import { CssBaseline } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
// import withWidth from "@material-ui/core/withWidth";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import ListAltIcon from "@material-ui/icons/ListAlt";
import EventIcon from "@material-ui/icons/Event";
import GroupIcon from "@material-ui/icons/Group";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import Login from "./components/Login/Login";
import Logout from "./components/Logout/Logout";
import Home from "./components/Home/Home";
import Admin from "./components/Admin/Admin";
import Roster from "./components/Roster/Roster";

const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: teal,
    secondary: indigo,
    error: darkRed
  },
  status: {
    danger: "orange"
  },
  typography: {
    useNextVariants: true
  }
});

const styles = theme => ({
  root: {
    width: "100%"
  },
  grow: {
    flexGrow: 1
  },
  appBar: {
    marginBottom: "20px"
  },
  routes: {
    marginBottom: "60px"
  },
  button: {
    marginRight: theme.spacing.unit
  },
  buttons: {
    display: "flex",
    justifyContent: "row"
  },
  stickToBottom: {
    width: "100%",
    position: "fixed",
    bottom: 0
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
            <AppBar className={classes.appBar} position="static">
              <Toolbar>
                <IconButton
                  className={classes.menuButton}
                  color="inherit"
                  aria-label="Menu"
                >
                  <MenuIcon />
                </IconButton>
                <Typography className={classes.grow}>
                  <Link
                    href="/"
                    variant="h6"
                    color="inherit"
                  >
                    BackSlash
                  </Link>
                </Typography>
                {authenticated ? (
                  <div className={classes.buttons}>
                    <Button
                      variant="outlined"
                      href="/admin"
                      className={classes.button}
                    >
                      Admin
                    </Button>
                    <Logout />
                  </div>
                ) : (
                  <Login />
                )}
              </Toolbar>
            </AppBar>

            <div className="main-component">
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
                      icon={<EventIcon />}
                    />
                    <BottomNavigationAction
                      label="Roster"
                      icon={<GroupIcon />}
                    />
                    <BottomNavigationAction
                      label="Seasons"
                      icon={<ListAltIcon />}
                    />
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
