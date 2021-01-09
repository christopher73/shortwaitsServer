const router = require("express").Router();
const authRouter = require("./auth");

router.use("/a", authRouter);

module.exports = router;
