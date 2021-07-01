//User Authentication

const auth = firebase.auth();

const signedIn = document.getElementById('signedIn');
const signedOut = document.getElementById('signedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');
const userDetails = document.getElementById('userDetails');

const provider = new firebase.auth.GoogleAuthProvider();

//Sign In Handler
signInBtn.onclick = () => auth.signInWithPopup(provider);
signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if(user){
        signedIn.hidden = false;
        signedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hello ${user.displayName}</h3><img src="${user.photoUrl}" />`
    }
    else{
        signedOut.hidden = false;
        signedIn.hidden = true;
    }
});

//Firestore
const db = firebase.firestore();

const createThing = document.getElementById('createThings');
const thingsList = document.getElementById('thingsList');

let thingsRef;
let unsubscribe;

auth.onAuthStateChanged(user => {
    if(user){
        
        thingsRef = db.collection('things')
        createThing.onclick = () => {

            const { serverTimestamp } = firebase.firestore.FieldValue;

            thingsRef.add({
                uid: user.uid,
                name: faker.commerce.productName(),
                createdAt: serverTimestamp() 
            });
        }

        unsubscribe = thingsRef
        .where('uid', '==', 'user.uid')
        .onSnapshot(querySnapshot => {

            const items = querySnapshot.docs.map(doc => {
                return `<li>${ doc.data().name }</li>`
            });
            console.log(items)
            thingsList.innerHTML = items.join('')
        });
    }
    else{
        unsubscribe && unsubscribe();
        createThing.onclick = null;
    }
});