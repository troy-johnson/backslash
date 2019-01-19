import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import firebase from "../../config/firebase";

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
  state = { Roster: [] };

  componentDidMount() {
    db.collection("players")
      .get()
      .then(querySnapshot => {
        const Roster = [];
        querySnapshot.forEach(doc => {
          Roster.push({
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
        this.setState({ Roster });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
  }

  render() {
    return (
      <div className={this.props.classes.root}>
        ROSTER:
        {this.state.Roster.map(player => {
          return (
            <div key={player.id}>
              Jersey Number: {player.jerseyNumber}
              Jersey Size: {player.jerseySize}
              First Name: {player.firstName}
              Last Name: {player.lastName}
              Email: {player.emailAddress}
              Phone: {player.phoneNumber}
              Status: {player.status}
            </div>
          );
        })}
      </div>
    );
  }
}

export default withStyles(styles)(Roster);
