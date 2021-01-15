// const checkUserByPhoneNumber = async (phoneNumber) => {
//   usersRef
//     .where("phoneNumber", "==", phoneNumber)
//     .get()
//     .then((snap) => {
//       let _id;
//       snap.forEach((doc) => {
//         _id = doc.id;
//       });
//       return {
//         isUserRegistered: !snap.empty,
//         userID: snap.empty ? null : _id,
//       };
//     });
// };
