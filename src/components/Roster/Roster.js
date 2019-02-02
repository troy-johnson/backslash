import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import firebase from "../../config/firebase";
// import * as PlayerService from "../../services/player";

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
      <div className={this.props.classes.root}>
        ACTIVE ROSTER:
        {this.state.roster
          .filter(e => e.status === "Active")
          .map(player => {
            return (
              <div key={player.id}>
                {`
              No.: ${player.jerseyNumber || '00'}
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
        INACTIVE ROSTER:
        {this.state.roster
          .filter(e => e.status === "Inactive")
          .map(player => {
            return (
              <div key={player.id}>
                {`
              No.: ${player.jerseyNumber || '00'}
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
      </div>
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
}

export default withStyles(styles)(Roster);
