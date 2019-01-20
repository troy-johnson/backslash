import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import firebase from "../../config/firebase";

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

class Admin extends Component {
  state = {
    authenticated: false,
    user: {
      displayName: null,
      photoURL: null,
      email: null
    }
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authenticated: true,
          user: {
            displayName: user.displayName,
            photoURL: user.photoURL,
            email: user.email
          }
        });
      } else if (!user) {
        this.setState({
          authenticated: false,
          user: {
            displayName: null,
            photoURL: null,
            email: null
          }
        });
      }
    });
  }

  render() {
    const { user, authenticated } = this.state;
    // console.log('user', user)
    // if (!authenticated) {
    //   return <Redirect to="/" />;
    // } else if (authenticated) {
    //   console.log("user email", user.email);

    // TODO: Redirect user to home if not logged in

    return <div>Welcome {user.email}!</div>;
  }
}

export default withStyles(styles)(Admin);
