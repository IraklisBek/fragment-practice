const express = require("express");

const UserController = require("../controllers/users");

const router = express.Router();

router.get("",
    UserController.getUsers
);

router.get("/:id",
    UserController.getUser
);

router.get("/liked_by_users/:post_id",
    UserController.getUsersLikedAPost
);

router.put("/:id",
    UserController.updateUser
);

module.exports = router;