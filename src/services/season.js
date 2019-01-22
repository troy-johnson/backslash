import firebase from "../config/firebase";

const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

export const upsertSeason = (seasonId) => {

}

export const delSeason = (seasonId) => {

}