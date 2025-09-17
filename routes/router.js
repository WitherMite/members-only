const { Router } = require("express");
const controller = require("../controllers/controller");
const router = Router();

router
  .get("/", controller.viewIndex)
  .get("/signup", controller.viewSignupForm)
  .post("/signup", controller.addUser);

module.exports = router;
