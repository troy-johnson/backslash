import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import firebase from "../../config/firebase";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";

const styles = theme => ({
  root: {
    // border: "1px solid lightblue",
    textAlign: "center",
    margin: "15px",
    // width: "85%",
    // maxWidth: "100%",
    flexGrow: 1
  },
  season: {
    // border: '1px solid green',
    // flexGrow: 1,
    [theme.breakpoints.down('sm')]: {
      flexBasis: '100%',
    },
    [theme.breakpoints.up('md')]: {
      flexBasis: '48.75%',
    },
    [theme.breakpoints.up('lg')]: {
      flexBasis: '31.5%',
    },
    // maxWidth: "86%"
  },
  game: {
    // border: '1px solid orange',
    alignItems: 'center',
    marginTop: "5px",
    marginBottom: "5px"
  },
  gameWin: {
    color: "green"
  },
  gameLoss: {
    color: "red"
  },
  gameTie: {
    color: ""
  },
  border: {
    // border: '1px solid yellowgreen'
  }
});

const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

class Seasons extends Component {
  state = {
    seasons: []
  };

  render() {
    const { seasons } = this.state;
    const { classes } = this.props;

    return (
      <Grid className={classes.root} container justify="center">
        {seasons
          .sort((a, b) => b.seasonNumber - a.seasonNumber)
          .slice(0, 1)
          .map(season => {
            return (
              <Paper className={classes.season} key={season.seasonNumber}>
                <Typography variant="h6">
                  Season #{season.seasonNumber} ({season.wins} - {season.losses}{" "}
                  - {season.ties})
                </Typography>
                {season.games.map(game => {
                  let result =
                    game.backslashGoals > game.opponentGoals
                      ? "Win"
                      : game.backslashGoals < game.opponentGoals
                      ? "Loss"
                      : game.backslashGoals &&
                        game.backslashGoals === game.opponentGoals
                      ? "Tie"
                      : !game.backslashGoals
                      ? ""
                      : "";
                  return (
                    <Grid
                      className={classes.game}
                      key={game.gameNumber}
                      container
                    >
                      <Grid className={classes.border} item xs={6}>
                        <Typography variant="subtitle1">
                          BackSlash vs. {game.opponent}
                        </Typography>
                      </Grid>

                      <Grid className={classes.border} item xs={6}>
                        <Typography
                          className={
                            result === "Win"
                              ? classes.gameWin
                              : result === "Loss"
                              ? classes.gameLoss
                              : result === "Tie"
                              ? classes.gameTie
                              : result === ""
                              ? ""
                              : ""
                          }
                          variant="subtitle1"
                        >
                          {result === "Win"
                            ? "W"
                            : result === "Loss"
                            ? "L"
                            : result === "Tie"
                            ? "T"
                            : result === ""
                            ? ""
                            : ""}{" "}
                          {game.backslashGoals}{" "}
                          {result
                            ? "-"
                            : new Date(
                                game.date.seconds * 1000
                              ).toLocaleDateString()}{" "}
                          {game.opponentGoals}
                        </Typography>
                      </Grid>
                    </Grid>
                  );
                })}
              </Paper>
            );
          })}
      </Grid>
    );
  }

  async componentDidMount() {
    const seasonRes = await db.collection("events").get();

    let seasons = [];

    await seasonRes.docs.forEach(e => {
      let wins = 0;
      let losses = 0;
      let ties = 0;

      for (let i = 0; i < e.data().games.length; i++) {
        if (
          e.data().games[i].backslashGoals > e.data().games[i].opponentGoals
        ) {
          wins++;
        } else if (
          e.data().games[i].backslashGoals < e.data().games[i].opponentGoals
        ) {
          losses++;
        } else if (
          e.data().games[i].backslashGoals &&
          e.data().games[i].backslashGoals === e.data().games[i].opponentGoals
        ) {
          ties++;
        }
      }

      let data = {
        ...e.data(),
        wins: wins,
        losses: losses,
        ties: ties
      };

      seasons.push(data);
    });
    seasons.sort((a, b) => {
      return a.seasonNumber - b.seasonNumber;
    });
    this.setState({ seasons });
  }
}

export default withStyles(styles)(Seasons);
