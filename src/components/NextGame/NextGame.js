import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import firebase from "../../config/firebase";
// import Paper from "@material-ui/core/Paper";
import EditIcon from "@material-ui/icons/Edit";
import Grid from "@material-ui/core/Grid";
import { Typography, IconButton } from "@material-ui/core";

const styles = {
  root: {
    // border: '1px solid lightblue',
    textAlign: "center"
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
      scratches: [],
      unassigned: []
    }
  };

  addPlayerToGameRoster(id) {
    // Add player to game roster
    // Add player to state -> game roster
    // Remove player from game scratches
    // Remove player from state -> unassigned
  }

  addPlayerToGameScratches(id) {
    // Add player to game scratches
    // Add player to state -> scratches
    // Remove player from game roster
    // Remove player from state -> full roster
  }

  render() {
    const { nextGame } = this.state;
    const { classes, admin } = this.props;

    return (
      <Grid className={classes.root} container spacing={24} justify="center">
        <div>
          {admin ? (
            <IconButton>
              <EditIcon />
            </IconButton>
          ) : (
            ""
          )}
        </div>

        <Grid item xs={12}>
          <Typography variant="h4">
            BackSlash vs. {nextGame.opponent}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">
            {nextGame.date} at {nextGame.time}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">{nextGame.location}</Typography>
        </Grid>

        <Grid item xs={6} sm={4}>
          <Typography variant="subtitle2">
            GAME ROSTER:
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
          </Typography>
        </Grid>

        <Grid item xs={6} sm={4}>
          <Typography variant="subtitle2">
            SCRATCHES:
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
          </Typography>
        </Grid>
      </Grid>
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

    const unassigned = [];

    const rosterRes = await docRef.get();
    rosterRes.forEach(doc => {
      let player =
        gameRoster.find(e => e.id === doc.data().id) ||
        scratches.find(e => e.id === doc.data().id);
      if (doc.data().status === "Active" && !player) {
        let unassignedPlayer = {
          ...doc.data(),
          id: doc.id,
          name: `${doc.data().firstName} ${doc.data().lastName}`
        };
        unassigned.push(unassignedPlayer);
      }
    });

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
        scratches: scratches,
        unassigned: unassigned
      }
    });
  }
}

export default withStyles(styles)(NextGame);
