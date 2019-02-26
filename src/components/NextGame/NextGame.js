import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import firebase from "../../config/firebase";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const styles = theme => ({
  root: {
    // border: '1px solid lightblue',
    textAlign: "center",
    margin: "15px"
  },
  nextGame: {
    minWidth: "65%",
    maxWidth: "100%",
    // border: "1px solid red",
    padding: "12px"
  },
  players: {
    marginTop: "7px",
    marginBottom: "7px",
    backgroundColor: theme.palette.secondary
  },
  border: {
    // border: "1px solid yellow"
  },
  playerList: {
    display: "flex",
    justifyContent: "column"
  },
  input: {
    width: "100%"
  },
  tabs: {
    flexGrow: "1",
    backgroundColor: theme.palette.primary,
    color: theme.palette.primary
  },
  button: {
    display: "block",
    marginTop: theme.spacing.unit * 2
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    flexGrow: "1"
  },
  tabsIndicator: {
    backgroundColor: "ghostwhite"
  }
});

const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

class NextGame extends Component {
  state = {
    selectedPlayer: "",
    open: false,
    tabValue: 0,
    season: [],
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

  handleTabChange = (event, value) => {
    this.setState({ tabValue: value });
  };

  handleChange = event => {
    this.setState({ selectedPlayer: event.target.value });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  addPlayerToGame = async event => {
    // const { season, nextGame } = this.state;
    // let roster = [];
    // let scratches = [];
    // console.log("season", season);
    // let game = season.games.find(e => e.gameNumber === nextGame.gameNumber);
    // console.log("game", game);
    // await this.setState({ season.games })
    // await db.collection("events")
    //         .doc(seasonId)
    //         .update({ games: games }, { merge: true })
    // Add player to state -> game roster
    // Remove player from game scratches
    // Remove player from state -> unassigned
  };

  AddPlayerModal = props => {
    const { type } = props;
    const { nextGame } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <IconButton
          color="primary"
          className={classes.button}
          aria-label={`Add player to ${type}`}
          onClick={this.handleClickOpen}
        >
          <PersonAddIcon />
        </IconButton>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={this.state.open}
          onClose={this.handleClose}
        >
          <DialogTitle>Add Player to {type}</DialogTitle>
          <DialogContent>
            <form className={classes.container} onSubmit={this.addPlayerToGame}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="unassigned-players">Players</InputLabel>
                <Select
                  autoWidth={true}
                  value={this.state.selectedPlayer}
                  onChange={this.handleChange}
                  input={<Input id="unassigned-players" />}
                >
                  {nextGame.unassigned.map(player => {
                    return (
                      <MenuItem key={player.id} value={player.id}>
                        {player.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" onClick={this.handleClose} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  render() {
    const { nextGame, tabValue } = this.state;
    const { classes, admin } = this.props;
    const { AddPlayerModal } = this;

    return (
      <div>
        {nextGame ? (
          <Grid
            className={classes.root}
            container
            direction="row"
            justify="center"
          >
            <Paper className={classes.nextGame}>
              <Grid className={classes.border} item xs={12}>
                <Typography variant="h4">
                  BackSlash vs. {nextGame.opponent}
                </Typography>
              </Grid>

              <Grid className={classes.border} item xs={12}>
                <Typography variant="h6">
                  {nextGame.date} at {nextGame.time}
                </Typography>
              </Grid>

              <Grid className={classes.border} item xs={12}>
                <Typography variant="h6">{nextGame.location}</Typography>
              </Grid>

              <Grid className={classes.players} container spacing={24}>
                <div className={classes.tabs}>
                  <AppBar position="static">
                    <Tabs
                      className={classes.tabs}
                      value={tabValue}
                      classes={{ indicator: classes.tabsIndicator }}
                      onChange={this.handleTabChange}
                      variant="fullWidth"
                    >
                      <Tab label="Roster" />
                      <Tab label="Scratches" />
                    </Tabs>
                  </AppBar>

                  {tabValue === 0 && (
                    <Grid className={classes.playerList} item xs={6}>
                      <Typography variant="subtitle2">
                        {admin ? (
                          <AddPlayerModal
                            type="Game Roster"
                            open={this.state.open}
                            onClose={this.handleClose}
                          />
                        ) : (
                          ""
                        )}

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
                  )}

                  {tabValue === 1 && (
                    <Grid className={classes.playerList} item xs={6}>
                      <Typography variant="subtitle2">
                        {admin ? (
                          <AddPlayerModal
                            type="Scratches"
                            open={this.state.open}
                            onClose={this.handleClose}
                          />
                        ) : (
                          ""
                        )}
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
                  )}
                </div>
              </Grid>
            </Paper>
          </Grid>
        ) : (
          ""
        )}
      </div>
    );
  }

  async componentDidMount() {
    const seasonRes = await db
      .collection("events")
      .doc("1yRF6Tjxre9jTUut7eFT")
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

    if (filteredGames && filteredGames.length > 0) {
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
        season: seasonRes.data(),
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
}

export default withStyles(styles)(NextGame);
