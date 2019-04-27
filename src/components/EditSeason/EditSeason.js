import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import firebase from "../../config/firebase";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { Typography } from "@material-ui/core";

const styles = theme => ({
  root: {
    // border: "1px solid lightblue",
    textAlign: "center",
    margin: "15px",
    // width: "85%",
    // maxWidth: "100%",
    flexGrow: 1,
    display: "flex"
  },
  season: {
    // border: '1px solid green',
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("sm")]: {
      flexBasis: "100%"
    },
    [theme.breakpoints.up("md")]: {
      flexBasis: "48.75%"
    },
    [theme.breakpoints.up("lg")]: {
      flexBasis: "31.5%"
    }
    // maxWidth: "86%"
  },
  select: {
    alignSelf: "flex-end"
    // border: '1px solid yellowgreen'
  },
  border: {
    // border: '1px solid yellowgreen'
  }
});

const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

class EditSeason extends Component {
  state = {
    seasons: [],
    currentSeason: 0
  };

  handleChange = event => {
    this.setState({ currentSeason: event.target.value });
  };

  render() {
    const { seasons, currentSeason } = this.state;
    const { classes } = this.props;

    return (
      <Grid className={classes.root} container justify="center">
        <Paper className={classes.season}>
          <Typography variant="h5">Edit Seasons</Typography>
          <Select
            className={classes.select}
            value={currentSeason}
            onChange={this.handleChange}
          >
            {seasons
              .sort((a, b) => b.seasonNumber - a.seasonNumber)
              .map(season => {
                return (
                  <MenuItem
                    key={season.seasonNumber}
                    value={season.seasonNumber}
                  >
                    Season {season.seasonNumber}
                  </MenuItem>
                );
              })}
          </Select>
          <Typography variant="h6">
            {currentSeason === 0
              ? ""
              : "Season " +
                seasons[
                  seasons.findIndex(el => el.seasonNumber === currentSeason)
                ].seasonNumber}
          </Typography>
          <Typography variant="h6">
            {currentSeason === 0
              ? ""
              : seasons[
                  seasons.findIndex(el => el.seasonNumber === currentSeason)
                ].eventOrganizerUrl}
          </Typography>
        </Paper>
      </Grid>
    );
  }

  async componentDidMount() {
    const seasonRes = await db.collection("events").get();

    let seasons = [];

    await seasonRes.docs.forEach(e => {
      seasons.push(e.data());
    });
    seasons.sort((a, b) => {
      return b.seasonNumber - a.seasonNumber;
    });
    this.setState({ seasons, currentSeason: seasons[0].seasonNumber });
  }
}

export default withStyles(styles)(EditSeason);
