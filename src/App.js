import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import firebase from "./config/firebase";
import NextGame from "./components/NextGame/NextGame";
import Roster from "./components/Roster/Roster";

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
  render() {
    return (
      <div className={this.props.classes.root}>
        BackSlash
        <div className="main-component">
          <NextGame />
          <Roster />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(App);
