const express = require("express");

const PostsController = require("../controllers/posts")

const checkAuth = require("../middleware/check-auth");
const { photos } = require("../middleware/file-upload");

const router = express.Router();


router.get("",
    PostsController.getPosts
);

router.get("/:id",
    PostsController.getPost
);

router.get("/tags/:tags",
    PostsController.getPostsByTags
);

router.get("/location/:location",
    PostsController.getPostsByLocation
);

router.get("/location_tags/:location/:tags",
    PostsController.getPostsByTagsAndLocation
);

// I am putting the middleware before multer because i dont want images if not loggedin
router.post("",
    // checkAuth,
    photos,
    PostsController.addPost
);

//router.put put a new resource and completely replace the old one
//router.patch to only update an existing resource with new values

router.put("/:id",
    checkAuth,
    photos,
    PostsController.updatePost
);

router.put("/comments/:id",
    // checkAuth,
    // photos,
    PostsController.updateComments
);

router.delete("/:id",
    checkAuth,
    PostsController.deletePost
);

module.exports = router;