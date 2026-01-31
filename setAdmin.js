const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // your key file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pinmate-v2-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const uid = "B7Sb4Kq9qwPgoc3ygSTtHCFAXcF2"; // get this from Firebase Auth

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log("Admin claim set for user:", uid);
  })
  .catch(err => console.error(err));
