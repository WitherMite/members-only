const { Router } = require("express");
const controller = require("../controllers/controller");
const router = Router();

router.get("/", controller.viewIndex);
router.get("/new", controller.viewMessageForm);
router.get("/signup", controller.viewSignupForm);
router.get("/login", controller.viewLoginForm);
router.get("/member-form", controller.viewMemberForm);
router.get("/admin-form", controller.viewAdminForm);
router.post("/new", controller.newMessage);
router.post("/signup", controller.addUser);
router.post("/login", controller.loginUser);
router.post("/logout", controller.logoutUser);
router.post("/member-form", controller.makeUserMember);
router.post("/admin-form", controller.makeUserAdmin);
router.post("/delete-msg", controller.deleteMessage);

module.exports = router;
