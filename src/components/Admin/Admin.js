import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import firebase from "../../config/firebase";
import AddPlayer from "../AddPlayer/AddPlayer";
import Roster from "../Roster/Roster";
import NextGame from "../NextGame/NextGame";
// import * as PlayerService from "../../services/player";
// import * as SeasonService from "../../services/season";

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
    roster: [],
    error: null
  };

  render() {
    return (
      <div className={this.props.classes.root}>
        <NextGame admin={true} />
        <Roster admin={true} />
        <AddPlayer />
      </div>
    );
  }
}

export default withStyles(styles)(Admin);
