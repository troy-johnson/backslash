import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import firebase from '../../config/firebase';

const styles = {
    root: {
      backgroundColor: 'blue',
      color: 'white'
    },
  };

const db = firebase.firestore();
db.settings({
    timestampsInSnapshots: true
});

class NextGame extends Component {

render() {
    return (
      <div className={this.props.classes.root}>
        NEXT GAME!
      </div>
    );
  }
}

export default withStyles(styles)(NextGame);
