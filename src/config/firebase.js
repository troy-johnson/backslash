import firebase from 'firebase/app'
import 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const config = {
    apiKey: "AIzaSyDTfzrhn2bKu74E8BX2Q0AG9WIj05rSu4s",
    authDomain: "backslash-76339.firebaseapp.com",
    databaseURL: "https://backslash-76339.firebaseio.com",
    projectId: "backslash-76339",
    storageBucket: "backslash-76339.appspot.com",
    messagingSenderId: "751957493995"
};

firebase.initializeApp(config);

export default firebase;