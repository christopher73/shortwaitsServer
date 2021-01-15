const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccountKey.json");
const payloads = require("../helpers/payloads");
const debug = require("debug")("shortwaits:firebase");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
const usersRef = db.collection("users");
const ordersRef = db.collection("orders");
const businessRef = db.collection("business");

const getAllUsers = async () => {
  const snapshot = await db.collection("users").get();
  snapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
  });
};

const getUserDataByID = async (_id) => {
  try {
    const userData = await usersRef.doc(_id).get();
    return userData;
  } catch (error) {
    return error;
  }
};
const setPreRegisteredUser = (userData) => {
  let newUser = usersRef.doc();
  return newUser.set(payloads.pendingUserRegistrationPayload(userData));
};
const getUsersByPhoneNumber = (phoneNumber) =>
  usersRef.where("phoneNumber", "==", phoneNumber).get();

const getUserFromSnapshot = (snapshot) => {
  let userData;
  snapshot.forEach((doc) => {
    userData = doc.data();
  });
  console.log(userData);
  return userData;
};
// const  = (ref) =>
// ref.empty ? {isUserRegistered: false,
// userID: snap.empty ? null : _id,}

module.exports = {
  getUserFromSnapshot,
  getAllUsers,
  setPreRegisteredUser,
  getUserDataByID,
  getUsersByPhoneNumber,
  getUserDataByID,
};
