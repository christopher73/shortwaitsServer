const twilioClient = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const verifyClientBySMS = (to, locale, channel = "sms") =>
  twilioClient.verify
    .services(process.env.TWILIO_SERVICE_ID)
    .verifications.create({
      locale,
      to,
      channel,
    });

//   update({
//   codeLength: 4,
//   friendlyName: "Shortwaits", //   *** opt 2 : shortwaits business
// })

const verifyClientOTP = (to, locale, code) =>
  twilioClient.verify
    .services(process.env.TWILIO_SERVICE_ID)
    .verificationChecks.create({
      locale,
      to,
      code,
    });

const verifyClientByWhatsapp = () => {};

module.exports = { verifyClientBySMS, verifyClientByWhatsapp, verifyClientOTP };
