import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import firebase from "../../config/firebase";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
// import * as PlayerService from "../../services/player";

const styles = {
  root: {
    // border: '1px solid pink',
    textAlign: 'center'
  }
};

const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

class Roster extends Component {
  state = { roster: [] };

  componentDidMount() {
    this.unsubscribe = db.collection("players").onSnapshot(
      res => {
        const roster = [];
        res.forEach(doc => {
          roster.push({
            id: doc.id,
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            jerseyNumber: doc.data().jerseyNumber,
            jerseySize: doc.data().jerseySize,
            email: doc.data().email,
            phone: doc.data().phone,
            status: doc.data().status
          });
        });
        roster.sort((a, b) => a.jerseyNumber - b.jerseyNumber);
        this.setState({ roster: roster });
      },
      err => {
        console.log(`Error: ${err}`);
      }
    );
    // TODO: Move database call to service;
    // TODO: The below wasn't re-rendering despite state updating
    // const response = await PlayerService.getPlayers();
    // const roster = await response;
    // await console.log('cDM', roster)
    // this.setState({ roster: roster });
    // console.log('state', this.state.roster)
  }

  render() {
    return (
      <Grid className={this.props.classes.root} container spacing={24}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">
            ACTIVE ROSTER:
            {this.state.roster
              .filter(e => e.status === "Active")
              .map(player => {
                return (
                  <div key={player.id}>
                    {`
              No.: ${player.jerseyNumber || "00"}
              Name: ${player.firstName} ${player.lastName}
              Status: ${player.status}
            `}
                    {this.props.admin
                      ? `Email: ${player.email} 
                    Phone: ${player.phone} 
                    Edit Player`
                      : ``}
                  </div>
                );
              })}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">
            INACTIVE ROSTER:
            {this.state.roster
              .filter(e => e.status === "Inactive")
              .map(player => {
                return (
                  <div key={player.id}>
                    {`
              No.: ${player.jerseyNumber || "00"}
              Name: ${player.firstName} ${player.lastName}
              Status: ${player.status}
            `}
                    {this.props.admin
                      ? `Email: ${player.email} 
                    Phone: ${player.phone} 
                    Edit Player`
                      : ``}
                  </div>
                );
              })}
          </Typography>
        </Grid>
      </Grid>
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
}

export default withStyles(styles)(Roster);
