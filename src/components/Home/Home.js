import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import firebase from "../../config/firebase";
import NextGame from "../NextGame/NextGame"
import Roster from "../Roster/Roster"

const styles = {
  root: {
    backgroundColor: "red",
    color: "white"
  }
};

const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

class Home extends Component {
  state = { Roster: [] };

  render() {
    return (
      <div className={this.props.classes.root}>
        <NextGame />
        <Roster />
      </div>
    );
  }
}

export default withStyles(styles)(Home);
