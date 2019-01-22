import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import firebase from "../../config/firebase";

const styles = {
  root: {
    backgroundColor: "blue",
    color: "white"
  }
};

const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

class NextGame extends Component {
  state = {
    nextGame: {}
  };

  render() {
    return (
      <div className={this.props.classes.root}>
        NEXT GAME: Game No. {this.state.nextGame.gameNumber}
        Date: {this.state.nextGame.date}
        Time: {this.state.nextGame.time}
        Location: {this.state.nextGame.location}
        Opponent: {this.state.nextGame.opponent}
        Roster: {
          this.state.nextGame.roster ? this.state.nextGame.roster.map(player => {
            if (player) {
              return (
                <div key={player.id}>
                  No.: {player.jerseyNumber}
                  Name: {`${player.firstName} ${player.lastName}`}
                </div>
              );
            } else {
              return null;
            }
          }) : ""
        }
        Scratches: {
          this.state.nextGame.scratches ? this.state.nextGame.scratches.map(player => {
            if (player) {
              return (
                <div key={player.id}>
                  No.: {player.jerseyNumber}
                  Name: {`${player.firstName} ${player.lastName}`}
                </div>
              );
            } else {
              return null;
            }
          }) : ""
        }
      </div>
    );
  }

  componentDidMount() {
    let filteredGames = {};

    db.collection("events")
      // TOOD: Refactor to dynamically get current season.
      .doc("xkUGwB24DSspXg54qUNA")
      .get()
      .then(res => {
        filteredGames = res
          .data()
          .games.filter(game => {
            if (game.date && game.date.seconds) {
              return game.date.seconds >= Date.now() / 1000;
            } else {
              return null;
            }
          })
          .sort((a, b) => {
            return a.gameNumber - b.gameNumber;
          });
        this.setState({
          nextGame: {
            gameNumber: filteredGames[0].gameNumber,
            date: new Date(filteredGames[0].date.seconds * 1000).toLocaleDateString(),
            time: new Date(filteredGames[0].date.seconds * 1000).toLocaleTimeString(),
            location: filteredGames[0].location,
            opponent: filteredGames[0].opponent,
            roster: filteredGames[0].roster,
            scratches: filteredGames[0].scratches
          }
        });
      });
  }

}

export default withStyles(styles)(NextGame);
