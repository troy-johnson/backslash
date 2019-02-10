import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import firebase from "../../config/firebase";

const styles = {
  root: {}
};

class Logout extends Component {
  logOutUser = () => {
    firebase.auth().signOut();
  };

  render() {
    return (
      <Button variant="outlined" color="primary" onClick={this.logOutUser}>
        Logout
      </Button>
    );
  }
}

export default withStyles(styles)(Logout);
