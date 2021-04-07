const express = require("express");

const TagController = require("../controllers/tags");

const router = express.Router();

router.get("",
    TagController.getTags
);

router.post("",
    TagController.addTag
);

router.get("/:name",
    TagController.getTagByName
);

router.delete("/:id",
    TagController.deleteTag
);

router.delete("/name/:name",
    TagController.deleteTagByName
);
module.exports = router;