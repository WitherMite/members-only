const { Router } = require("express");
const controller = require("../controllers/controller");
const router = Router();

router.get("/", controller.viewIndex);
router.get("/signup", controller.viewSignupForm);
router.get("/login", controller.viewLoginForm);
router.get("/member-form", controller.viewMemberForm);
router.post("/signup", controller.addUser);
router.post("/login", controller.loginUser);
router.post("/member-form", controller.makeUserMember);

module.exports = router;
