const { Router } = require("express");
const controller = require("../controllers/controller");
const router = Router();

router.get("/", controller.viewIndex);
router.get("/signup", controller.viewSignupForm);
router.post("/signup", controller.addUser);

module.exports = router;
