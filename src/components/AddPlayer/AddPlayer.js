import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import firebase from "../../config/firebase";
// import * as PlayerService from "../../services/player";

const styles = {
  root: {}
};

const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

class AddPlayer extends Component {
  state = {
    player: {
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      jerseyNumber: "",
      jerseySize: "",
      status: ""
    },
    message: "",
    error: ""
  };

  handleInputChange = event => {
    this.setState({
      player: {
        ...this.state.player,
        [event.target.name]: event.target.value
      }
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { player } = this.state;
    db.collection("players")
      .doc()
      .set({
        email: player.email,
        phone: player.phone,
        firstName: player.firstName,
        lastName: player.lastName,
        jerseyNumber: player.jerseyNumber,
        jerseySize: player.jerseySize,
        status: player.status
      })
      .then(() => {
        this.setState({
          message: `Player successfully created!`,
          player: {
            email: "",
            phone: "",
            firstName: "",
            lastName: "",
            jerseyNumber: "",
            jerseySize: "",
            status: ""
          }
        });
      })
      .catch(err => {
        this.setState({
          error: `Error: ${err}`
        });
      });
  };

  render() {
    const { player, message, error } = this.state;
    return (
      <div className={this.props.classes.root}>
        Add Player
        {error ? error : ""}
        {message ? message : ""}
        <form onSubmit={this.handleSubmit}>
          {/* TODO: Add validation */}
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={player.email}
            onChange={this.handleInputChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={player.phone}
            onChange={this.handleInputChange}
          />
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={player.firstName}
            onChange={this.handleInputChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={player.lastName}
            onChange={this.handleInputChange}
          />
          <input
            type="number"
            name="jerseyNumber"
            placeholder="Jersey Number"
            value={player.jerseyNumber}
            onChange={this.handleInputChange}
          />
          <input
            type="text"
            name="jerseySize"
            placeholder="Jersey Size"
            value={player.jerseySize}
            onChange={this.handleInputChange}
          />
          <input
            type="text"
            name="status"
            placeholder="Status"
            value={player.status}
            onChange={this.handleInputChange}
          />
          <button children="Add Player" />
        </form>
      </div>
    );
  }
}

export default withStyles(styles)(AddPlayer);
