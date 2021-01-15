const { body, validationResult } = require("express-validator");
//helper file to prepare responses.
const apiResponse = require("../../helpers/apiResponse");

const utility = require("../../helpers/utility");
const bcrypt = require("bcrypt");
const { twilio, firebase } = require("../../services");
//const jwt = require("jsonwebtoken");
// const { constants } = require("../../helpers/constants");

exports.verifyNum = [
  body("countryCode")
    .isString()
    .isLength({ min: 1, max: 4 })
    .isISO31661Alpha2()
    .withMessage("Invalid country code"),
  body("locale")
    .isString()
    .isLength({ min: 1, max: 6 })
    .isLocale()
    .withMessage("Invalid locale code"),
  body("authType")
    .isString()
    .isLength({ min: 1, max: 10 })
    .trim()
    .withMessage("Invalid form of authentication")
    .custom((value) => {
      if (value === "whatsapp" || value === "sms") {
        return Promise.resolve(value);
      } else {
        return Promise.reject("Incorrect form of authentication");
      }
    }),
  body("phoneNumber")
    .isMobilePhone("any", { strictMode: true })
    .withMessage("Number must be a real phone number."),
  body("phoneNumber").escape(),

  async (req, res) => {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Display sanitized values/errors messages.
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        // req.body.phoneNumber, req.body.locale, "sms"
        twilio
          .verifyClientBySMS(req.body.phoneNumber, req.body.locale, "sms")
          // .then((verifications) => {
          //   verifications.create({});
          // })
          .then(({ status }) => {
            apiResponse.successResponseWithData(
              res,
              "Verification initialized.",
              {
                verifyByStatus: status,
              }
            );
          })
          .catch((error) => {
            apiResponse.ErrorResponse(
              res,
              "Error initilizing verification" + error
            );
          });
      }
    } catch (error) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, "Server Error" + error);
    }
  },
];

// verify One Time Pin (OTP) for twilio user
exports.verifyOTP = [
  body("otp")
    .isString()
    .isLength({ min: 6, max: 6 })
    .withMessage("Invalid code"),
  body("locale")
    .isString()
    .isLength({ min: 1, max: 6 })
    .isLocale()
    .withMessage("Invalid locale code"),
  body("phoneNumber")
    .isMobilePhone("any", { strictMode: true })
    .withMessage("Number must be a real phone number."),
  body("phoneNumber").escape(),

  async (req, res) => {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Display sanitized values/errors messages.
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        const twilioResponse = await twilio.verifyClientOTP(
          req.body.phoneNumber,
          req.body.locale,
          req.body.otp
        );
        if (twilioResponse.valid) {
          const firebaseSnapshot = await firebase.getUsersByPhoneNumber(
            twilioResponse.to
          );

          if (!firebaseSnapshot.empty) {
            // const registeredUserData = firebase.getUserDataByID(userID);
            const userData = firebase.getUserFromSnapshot(firebaseSnapshot);
            apiResponse.successResponseWithData(
              res,
              "User is already registered",
              userData
            );
          } else {
            const preRegisteredUserData = firebase.setPreRegisteredUser(
              req.body
            );
            apiResponse.successResponseWithData(
              res,
              "User not fully registered",
              {
                ...preRegisteredUserData,
              }
            );
            // if not then start verification with twilio (request OT) for "pre regitration"
          }
        } else {
          apiResponse.notFoundResponse(
            res,
            "OTP incorrect or expired, try again"
          );
        }
      }
    } catch (err) {
      console.log(JSON.stringify(err));
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, "Server error");
    }
  },
];
exports.resendOTP = [(req, res) => apiResponse.successResponse(res, "resend")];
/**
 * User registration.
 *
 * @param {string}        firstName
 * @param {string}        firstName
 * @param {string}        lastName
 * @param {string}        phoneNumber
 * @param {array<string>} selectedServices
 *
 * @returns {Object}
 *
 **/
exports.register = [
  /**
   * @todo
   * maybe validate values too ?
   */
  body("authType")
    .isLength({ min: 1, max: 10 })
    .trim()
    .isString()
    .withMessage("Invalid form of authentication")
    .custom((value) => {
      if (value === "whatsapp" || value === "sms") {
        return Promise.resolve(value);
      } else {
        return Promise.reject("Incorrect form of authentication");
      }
    }),
  body("firstName")
    .isLength({ min: 1 })
    .trim()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("lastName")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Last name must be specified.")
    .isAlphanumeric()
    .withMessage("Last name has non-alphanumeric characters."),
  body("phoneNumber")
    .isMobilePhone("any", { strictMode: true })
    .withMessage("Number must be a real phone number."),
  body("selectedServices")
    .isArray({ min: 1, max: 6 })
    .withMessage("Amount services is incorrect"),
  // Process request after validation and sanitization.
  (req, res) => {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Display sanitized values/errors messages.
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        //hash input password
        apiResponse.successResponseWithData(res, "Registration Success.", [
          req.body,
        ]);
      }
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
