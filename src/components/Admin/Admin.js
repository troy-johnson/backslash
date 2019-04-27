import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import firebase from "../../config/firebase";
// import Roster from "../Roster/Roster";
import NextGame from "../NextGame/NextGame";
import EditSeason from "../EditSeason/EditSeason";
// import * as PlayerService from "../../services/player";
// import * as SeasonService from "../../services/season";

const styles = {
  root: {}
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
        <EditSeason />
        {/* <Roster admin={true} /> */}
      </div>
    );
  }
}

export default withStyles(styles)(Admin);
