const { body, validationResult, sanitizeBody } = require("express-validator");
//helper file to prepare responses.
const apiResponse = require("../../helpers/apiResponse");
const utility = require("../../helpers/utility");
const bcrypt = require("bcrypt");
//const jwt = require("jsonwebtoken");
// const { constants } = require("../../helpers/constants");

/**
 * User registration.
 *
 * @param {string}      firstName
 * @param {string}      lastName
 * @param {string}      phoneNumber
 * @param {array<string>}       preferedServices
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
  body("preferedServices")
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
