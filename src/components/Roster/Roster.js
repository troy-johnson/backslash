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
    db.collection("players")
      .get()
      .then(querySnapshot => {
        const roster = [];
        querySnapshot.forEach(doc => {
          roster.push({
            id: doc.id,
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            jerseyNumber: doc.data().jerseyNumber,
            jerseySize: doc.data().jerseySize,
            emailAddress: doc.data().emailAddress,
            phoneNumber: doc.data().phoneNumber,
            status: doc.data().status
          });
        });
        this.setState({ roster: roster });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
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
        ROSTER:
        {this.state.roster.map(player => {
          return (
            <div key={player.id}>
              id: {player.id}
              No.: {player.jerseyNumber}
              Name: {`${player.firstName} ${player.lastName}`}
              Status: {player.status}
              {this.props.admin ? 'Edit Player' : ''}
            </div>
          );
        })}
      </div>
    );
  }
}

export default withStyles(styles)(Roster);
