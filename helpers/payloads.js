const pendingUserRegistrationPayload = (userData) => ({
  ...userData,
  accountRegistrationState: "pending",
  savedBusiness: [null],
  orderHistory: [null],
  selectedServices: [null],
  purchasedItems: [null],
});

const successfulUserRegistrationPayload = (userData) => ({
  ...userData,
  accountRegistrationState: "successful",
});
module.exports = {
  pendingUserRegistrationPayload,
  successfulUserRegistrationPayload,
};
