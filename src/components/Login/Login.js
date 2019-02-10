import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Typography } from "@material-ui/core";

import firebase from "../../config/firebase";

const styles = {
  root: {},
  textField: {
    margin: "5px"
  },
  error: {
    color: "red"
  }
};

const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

class Login extends Component {
  state = {
    open: false,
    email: "",
    password: "",
    error: null
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleInputChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  handleSubmit = event => {
    const { email, password } = this.state;
    event.preventDefault();
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        this.setState({ open: false });
        this.props.history.push("/admin");
      })
      .catch(error => {
        this.setState({ error: error });
      });
  };

  render() {
    const { open, error } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <Button
          variant="outlined"
          color="primary"
          onClick={this.handleClickOpen}
        >
          Admin Login
        </Button>
        <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Admin Login</DialogTitle>
          <DialogContent>
            <Typography className={classes.error}>
              {error ? error.message : ""}
            </Typography>
            <DialogContentText />
            <form id="loginForm">
              <TextField
                id="email"
                className={classes.textField}
                label="Email Address"
                type="email"
                onChange={this.handleInputChange}
              />
              <TextField
                id="password"
                className={classes.textField}
                label="Password"
                type="password"
                onChange={this.handleInputChange}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.handleSubmit}
              form="loginForm"
              color="primary"
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(Login);
