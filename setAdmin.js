const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json"))
});

const UID = "mLrqe8qThnPkvUZ5uXLyFvcjfCw2"; // your UID

admin.auth().setCustomUserClaims(UID, { admin: true })
  .then(() => {
    console.log("✅ Admin claim set successfully");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
