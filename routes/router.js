const { Router } = require("express");
const controller = require("../controllers/controller");
const router = Router();

router
  .get("/", controller.renderMessages)
  .get("/message", controller.renderMessageByIndex)
  .get("/new", controller.renderMessageForm)
  .post("/new", controller.addMessage);

module.exports = router;
