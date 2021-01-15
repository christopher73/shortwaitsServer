var router = require("express").Router();
var RateLimiter = require("limiter").RateLimiter;
var limiter = new RateLimiter(10, "hour", true); // fire CB immediately

// this could be implemented using REDIS ??
router.use(function (req, res, next) {
  if (process.env.NODE_ENV === "dev") {
    limiter.removeTokens(1, function (err, remainingRequests) {
      if (remainingRequests < 1) {
        res.writeHead(429, { "Content-Type": "text/plain;charset=UTF-8" });
        res.end("429 Too Many Requests - your IP is being rate limited");
      } else {
        next();
      }
    });
  } else {
    next();
  }
});

module.exports = router;
