const express = require("express");

const UserController = require("../controllers/auth")

const { photos } = require("../middleware/file-upload");

const router = express.Router();

router.post("/signup", photos, UserController.createUser);
router.post("/login", UserController.userLogin);

module.exports = router;