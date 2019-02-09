import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import firebase from "../../config/firebase";

import NextGame from "../NextGame/NextGame";
// import Roster from "../Roster/Roster";
import Seasons from "../Seasons/Seasons";

const styles = {
  root: {}
};

const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

class Home extends Component {
  state = { Roster: [] };

  render() {
    return (
      <Grid
        className={this.props.classes.root}
        container
        spacing={24}
        justify="center"
        alignItems="center"
      >
        <NextGame />
        <Seasons />
        {/* <Roster /> */}
      </Grid>
    );
  }
}

export default withStyles(styles)(Home);
