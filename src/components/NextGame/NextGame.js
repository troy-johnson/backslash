import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import firebase from "../../config/firebase";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Fab from "@material-ui/core/Fab";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

const styles = theme => ({
  root: {
    // border: '1px solid lightblue',
    textAlign: "center"
  },
  nextGame: {
    // border: "1px solid red",
    padding: "12px"
  },
  players: {
    marginTop: "7px",
    marginBottom: "7px",
    backgroundColor: theme.palette.secondary
  },
  border: {
    border: "1px solid red",
    display: 'flex',
    justifyContent: 'flex-start',
    // flexDirection: 'column',
    width: "100%",
  },
  list: {
    width: '100%',
    maxHeight: '500px',
    overflow: 'scroll'
  },
  playerList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end"
    // border: "1px solid green"
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
    event.preventDefault();
    const { season, nextGame, selectedPlayer } = this.state;
    let game = await season.games.find(
      e => e.gameNumber === nextGame.gameNumber
    );
    await game.roster.push(selectedPlayer);
    let unassigned = nextGame.unassigned.filter(
      e => e.id !== selectedPlayer.id
    );
    this.setState({
      nextGame: {
        ...nextGame,
        gameRoster: game.roster,
        unassigned
      }
    });
    await db
      .collection("events")
      .doc("1yRF6Tjxre9jTUut7eFT")
      .set({ games: season.games }, { merge: true });
  };

  AddPlayerModal = props => {
    const { type } = props;
    const { nextGame, selectedPlayer } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <Fab
          color="primary"
          onClick={this.handleClickOpen}
          aria-label={`Add player to ${type}`}
        >
          <PersonAddIcon />
        </Fab>

        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={this.state.open}
          onClose={this.handleClose}
        >
          <DialogTitle>Add Player to {type}</DialogTitle>
          <DialogContent>
            <form
              id="addPlayer"
              className={classes.container}
              onSubmit={this.addPlayerToGame}
              playerooperation={type}
            >
              <FormControl className={classes.formControl}>
                <InputLabel>Players</InputLabel>
                <Select
                  autoWidth={true}
                  value={selectedPlayer}
                  onChange={this.handleChange}
                >
                  {nextGame.unassigned.map(player => {
                    return (
                      <MenuItem key={player.id} value={player}>
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
            <Button
              form="addPlayer"
              type="submit"
              onClick={this.handleClose}
              color="primary"
            >
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
                    <Grid className={classes.playerList} item>
                      <Typography variant="subtitle2" />

                      {nextGame.gameRoster ? (
                        <List className={classes.list} disablePadding={false}>
                          {nextGame.gameRoster.sort((a, b) => a.lastName.localeCompare(b.lastName)).map(player => {
                            return (
                              <ListItem alignItems="flex-start" divider={true} key={player.id}>
                                <ListItemText primary={player.jerseyNumber} />
                                <ListItemText primary={player.name} />
                                {admin ? (
                                  <ListItemSecondaryAction>
                                    <IconButton aria-label="Comments">
                                      <RemoveCircleOutlineIcon color="error" />
                                    </IconButton>
                                  </ListItemSecondaryAction>
                                ) : (
                                  ""
                                )}
                              </ListItem>
                            );
                          })}
                        </List>
                      ) : (
                        ""
                      )}
                      {admin ? (
                        <AddPlayerModal
                          type="Game Roster"
                          open={this.state.open}
                          onClose={this.handleClose}
                        />
                      ) : (
                        ""
                      )}
                    </Grid>
                  )}

                  {tabValue === 1 && (
                    <Grid className={classes.playerList} item>
                      <Typography variant="subtitle2" />

                      {nextGame.scratches ? (
                        <List>
                          {nextGame.scratches.sort((a, b) => a.lastName.localeCompare(b.lastName)).map(player => {
                            return (
                              <ListItem key={player.id}>
                                <ListItemText primary={player.jerseyNumber} />
                                <ListItemText primary={player.name} />
                                {admin ? (
                                  <ListItemSecondaryAction>
                                    <IconButton aria-label="Comments">
                                      <RemoveCircleOutlineIcon color="error" />
                                    </IconButton>
                                  </ListItemSecondaryAction>
                                ) : (
                                  ""
                                )}
                              </ListItem>
                            );
                          })}
                        </List>
                      ) : (
                        ""
                      )}
                      {admin ? (
                        <AddPlayerModal
                          type="Scratches"
                          open={this.state.open}
                          onClose={this.handleClose}
                        />
                      ) : (
                        ""
                      )}
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
        const playerRes = await docRef.doc(filteredGames[0].roster[i].id).get();
        const player = {
          id: playerRes.id,
          name: `${playerRes.data().firstName} ${playerRes.data().lastName}`,
          jerseyNumber: playerRes.data().jerseyNumber,
          lastName: playerRes.data().lastName
        };
        gameRoster.push(player);
      }

      for (let i = 0; i < filteredGames[0].scratches.length; i++) {
        const playerRes = await docRef
          .doc(filteredGames[0].scratches[i].id)
          .get();
        const player = {
          id: playerRes.id,
          name: `${playerRes.data().firstName} ${playerRes.data().lastName}`,
          jerseyNumber: playerRes.data().jerseyNumber,
          lastName: playerRes.data().lastName
        };
        scratches.push(player);
      }

      const unassigned = [];

      const rosterRes = await docRef.get();
      rosterRes.forEach(doc => {
        let player =
          gameRoster.find(e => e.id === doc.id) ||
          scratches.find(e => e.id === doc.id);
        if (doc.data().status === 'Active' && !player) {
          let unassignedPlayer = {
            ...doc.data(),
            id: doc.id,
            name: `${doc.data().firstName} ${doc.data().lastName}`,
            lastName: doc.data().lastName
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
          unassigned: unassigned.sort((a, b) => a.lastName.localeCompare(b.lastName))
        }
      });
    }
  }
}

export default withStyles(styles)(NextGame);
