import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import firebase from "../../config/firebase";

const styles = {
  root: {}
};

const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

class Login extends Component {
  state = {
    email: "",
    password: "",
    error: null
  };

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        this.props.history.push("/admin");
      })
      .catch(error => {
        this.setState({ error: error });
      });
  };

  render() {
    const { email, password, error } = this.state;
    return (
      <div className={this.props.classes.root}>
        Log In
        {error && error.message ? error.message : ""}
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={this.handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={this.handleInputChange}
          />
          <button children="Log In" />
        </form>
      </div>
    );
  }
}

export default withStyles(styles)(Login);
