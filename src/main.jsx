import './scss/style.scss'

import { ExpensesComponent } from './expenses.jsx'
import ReactDOM from 'react-dom';
import * as firebase from 'firebase'
import * as LuigiClient from '@kyma-project/luigi-client'
import { CarService } from './carService.js';

const firebaseConfig = {
    apiKey: "AIzaSyCNiQ3VTATbyL26rkJ6oT2zJH2nVXJZkbo",
    databaseURL: "https://trip-fc58b.firebaseio.com",
    projectId: "trip-fc58b",
    storageBucket: "trip-fc58b.appspot.com",
    messagingSenderId: "720905686784",
    appId: "1:720905686784:web:e7802edf416cde0b832de5"
};

firebase.initializeApp(firebaseConfig);

LuigiClient.addInitListener((context) => {
    var credential = firebase.auth.GoogleAuthProvider.credential(context.idToken);
    
    firebase.auth().signInWithCredential(credential)
        .then(() => {
            const database = firebase.database();
            const userId = firebase.auth().currentUser.uid
            const service = new CarService(database, userId)

            document.getElementById('root').style.display = ''

            ReactDOM.render(
                <ExpensesComponent carService={service} />,
                document.getElementById('root')
            );
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
})




