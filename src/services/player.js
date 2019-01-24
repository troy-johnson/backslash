import firebase from "../config/firebase";

const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

export const getPlayers = () => {
  const roster = [];
  db.collection("players")
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        roster.push({
          id: doc.id,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          jerseyNumber: doc.data().jerseyNumber,
          jerseySize: doc.data().jerseySize,
          emailAddress: doc.data().emailAddress,
          phoneNumber: doc.data().phoneNumber,
          status: doc.data().status
        });
      });
      // console.log('roster', roster);
      // return roster;
    })
    .catch(err => {
      console.log("Error getting players: ", err);
    });
  return roster;
};

export const upsertPlayer = player => {
  console.log('uP player', player);
  if (player.playerId) {
    db.collection("players")
      .doc(player.playerId)
      .set({
        email: player.email,
        phone: player.phone,
        firstName: player.firstName,
        lastName: player.lastName,
        jerseyNumber: player.jerseyNumber,
        jerseySize: player.jerseySize,
        status: player.status
      }).catch(err => {
        console.log(`Error: ${err}`)
      });
  } else {
    db.collection("players")
      .doc()
      .set({
        email: player.email,
        phone: player.phone,
        firstName: player.firstName,
        lastName: player.lastName,
        jerseyNumber: player.jerseyNumber,
        jerseySize: player.jerseySize,
        status: player.status
      }).catch(err => {
        console.log(`Error: ${err}`)
      });
  }
};

export const delPlayer = playerId => {
  db.collection("players")
    .doc(playerId)
    .delete();
};
