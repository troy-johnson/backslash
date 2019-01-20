import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import firebase from "../../config/firebase";

const styles = {
  root: {
    backgroundColor: "purple",
    color: "white"
  }
};

class Logout extends Component {
  logOutUser = () => {
    firebase.auth().signOut();
    console.log('logged out', firebase.auth().currentUser);
    
  };

  render() {
    return (
      <button onClick={this.logOutUser}>Log Out</button>
    );
  }
}

export default withStyles(styles)(Logout);
