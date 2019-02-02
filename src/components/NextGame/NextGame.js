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
    nextGame: {
      gameNumber: null,
      date: "",
      time: "",
      location: "",
      opponent: "",
      gameRoster: [],
      scratches: []
    },
    fullRoster: []
  };

  addPlayerToGameRoster(playerId) {
    // Add player to game roster
    // Remove player from state -> full roster
  }

  removePlayerFromGameRoster(playerId) {
    // Remove player from game roster
    // Add player to state -> full roster
  }

  addPlayerToGameScratches(playerId) {
    // Add player to game scratches
    // Remove player from state -> full roster
  }

  removePlayerFromGameScratches(playerId) {
    // Remove player from game scratches
    // Add player to state -> full roster
  }

  render() {
    const { nextGame } = this.state;
    return (
      <div className={this.props.classes.root}>
        NEXT GAME: Game No. {nextGame.gameNumber}
        Date: {nextGame.date}
        Time: {nextGame.time}
        Location: {nextGame.location}
        Opponent: {nextGame.opponent}
        Game Roster:
        {nextGame.gameRoster
          ? nextGame.gameRoster.map(player => {
              return (
                <div key={player.id}>
                  No.: {player.jerseyNumber}
                  Name: {player.name}
                </div>
              );
            })
          : ""}
        Scratches:
        {nextGame.scratches
          ? nextGame.scratches.map(player => {
              return (
                <div key={player.id}>
                  No.: {player.jerseyNumber}
                  Name: {player.name}
                </div>
              );
            })
          : ""}
      </div>
    );
  }

  async componentDidMount() {
    const seasonRes = await db
      .collection("events")
      .doc("xkUGwB24DSspXg54qUNA")
      .get();
    const filteredGames = await seasonRes
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

    const docRef = db.collection("players");
    const gameRoster = [];
    const scratches = [];

    for (let i = 0; i < filteredGames[0].roster.length; i++) {
      const playerRes = await docRef.doc(filteredGames[0].roster[i]).get();
      const player = {
        id: playerRes.id,
        name: `${playerRes.data().firstName} ${playerRes.data().lastName}`,
        jerseyNumber: playerRes.data().jerseyNumber
      };
      gameRoster.push(player);
    }

    for (let i = 0; i < filteredGames[0].scratches.length; i++) {
      const playerRes = await docRef.doc(filteredGames[0].scratches[i]).get();
      const player = {
        id: playerRes.id,
        name: `${playerRes.data().firstName} ${playerRes.data().lastName}`,
        jerseyNumber: playerRes.data().jerseyNumber
      };
      scratches.push(player);
    }

    this.setState({
      nextGame: {
        gameNumber: filteredGames[0].gameNumber,
        date: new Date(
          filteredGames[0].date.seconds * 1000
        ).toLocaleDateString(),
        time: new Date(
          filteredGames[0].date.seconds * 1000
        ).toLocaleTimeString(),
        location: filteredGames[0].location,
        opponent: filteredGames[0].opponent,
        gameRoster: gameRoster,
        scratches: scratches
      },
      fullRoster: []
    });
  }
}

export default withStyles(styles)(NextGame);
