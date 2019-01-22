import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import firebase from "../../config/firebase";
import AddPlayer from "../AddPlayer/AddPlayer";
import Roster from "../Roster/Roster"
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

  handleInputChange = event => {
    console.log("event", event);
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <div className={this.props.classes.root}>
        <Roster admin={true} />
        <AddPlayer />
      </div>
    );
  }
}

export default withStyles(styles)(Admin);
