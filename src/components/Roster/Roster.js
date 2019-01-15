import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import firebase from '../../config/firebase';

const styles = {
    root: {
      backgroundColor: 'red',
      color: 'white'
    },
  };

const db = firebase.firestore();
db.settings({
    timestampsInSnapshots: true
});

// const roster = [];

// const rosterQuery = async () => {
//     try {
//         await db.collection('players').get().then((player) => {
//             roster.push(player);
//         })
//         console.log('roster: ', roster);
//         return roster;
//     } catch (error) {
//         console.log('error: ', error);
//     }
// }

// docRef.get().then(async(doc) => {
//     if (doc.exists) {
//         console.log("Document data:", doc.data());
//     } else {
//         console.log("No such document!");
//     }
// }).catch((error) => {
//     console.log("Error getting document:", error);
// });

// db.collection("players").get().then(function(querySnapshot) {
//     querySnapshot.forEach(function(doc) {
//         // doc.data() is never undefined for query doc snapshots
//         console.log(doc.id, " => ", doc.data());
//     });
// });

class Roster extends Component {

    state = { Roster: [] };

    componentDidMount() {
        db.collection('players').get()
        .then(querySnapshot => {
            const Roster = [];
            querySnapshot.forEach((doc) => {
                Roster.push({
                    id: doc.id,
                    firstName: doc.data().firstName,
                    lastName: doc.data().lastName,
                    jerseyNumber: doc.data().jerseyNumber,
                    jerseySize: doc.data().jerseySize,
                    emailAddress: doc.data().emailAddress,
                    phoneNumber: doc.data().phoneNumber
                });
            });
            this.setState({ Roster });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    }

    render() {

        return (
            <div className={this.props.classes.root}>

            ROSTER:

            {this.state.Roster.map(player => {
                return (
                    <div key={player.id}>
                        Jersey Number: {player.jerseyNumber}
                        Jersey Size: {player.jerseySize}
                        First Name: {player.firstName}
                        Last Name: {player.lastName}
                        Email: {player.emailAddress}
                        Phone: {player.phoneNumber}
                    </div>
                )
            })}

            </div>

        );
    }
}

export default withStyles(styles)(Roster);
