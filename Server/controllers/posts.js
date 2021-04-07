const Post = require('../models/post');
const Comment = require('../models/comment');

const populate = [
    {
        path: "user"
    },
    {
        path: "tags"
    },
    {
        path: "likedBy"
    },
    {
        path: "comments"
    },
    {
        path: "comments",
        populate: {
            path: "user"
        }
    }
]

exports.getPosts = (req, res, next) => {
    // const pageSize = +req.query.pageSize;
    // const currentPage = +req.query.page;
    // const postQuery = Post.find();
    // let fetchedPosts;

    // if (pageSize && currentPage) {
    //     postQuery
    //         .skip(pageSize * (currentPage - 1))
    //         .limit(pageSize);
    // }
    Post.find().populate(populate)
        .then(documents => {
            fetchedPosts = documents;
            return Post.count();
        })
        .then(count => {
            res.status(200).json({
                message: "Posts fetched succesfully!",
                posts: fetchedPosts,
                maxPosts: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching posts failed"
            })
        });
}

exports.getPostsByLocation = (req, res, next) => {
    Post.find({ location: req.params.location }).populate(populate)
        .then(documents => {
            fetchedPosts = documents;
            res.status(200).json({
                message: "Posts by Location fetched succesfully!",
                posts: fetchedPosts
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching posts by Location failed"
            })
        });
}

exports.getPostsByTags = (req, res, next) => {
    const tags = JSON.parse(req.params.tags).map(tag => tag.name);;
    Post.find().populate({
        path: 'tags',
        match: {
            name: { $in: tags }
        }
    }).populate("user").populate("likedBy")
        .then(documents => {
            fetchedPosts = [];
            for (let i = 0; i < documents.length; i++) {
                if (documents[i].tags.length > 0) {
                    fetchedPosts.push(documents[i])
                }
            }
            res.status(200).json({
                message: "Posts by Tags fetched succesfully!",
                posts: fetchedPosts
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching posts by Tags failed"
            })
        });
}

exports.getPostsByTagsAndLocation = (req, res, next) => {
    const tags = JSON.parse(req.params.tags).map(tag => tag.name);
    const location = req.params.location;
    Post.find({ location: location }).populate({
        path: 'tags',
        match: {
            name: { $in: tags }
        }
    }).populate("user").populate("likedBy")
        .then(documents => {
            fetchedPosts = [];
            for (let i = 0; i < documents.length; i++) {
                if (documents[i].tags.length > 0) {
                    fetchedPosts.push(documents[i])
                }
            }
            res.status(200).json({
                message: "Posts by Tags fetched succesfully!",
                posts: fetchedPosts
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching posts by Tags failed"
            })
        });
}

exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).populate(populate)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'Post not found!' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching post failed"
            })
        });
}

exports.addPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    var main_photo = req.files?.photo[0].filename;
    var photos = [];
    var videos = [];
    var music = [];
    var likedBy = []
    var supportedBy = []

    for (var ph in req.files?.photo) {
        main_photo = url + "/images/" + req.files?.photo[ph].filename;
    }

    for (var photo in req.files?.photos) {
        photos.push(url + "/images/" + req.files?.photos[photo].filename)
    }

    for (var video in req.files?.videos) {
        videos.push(url + "/videos/" + req.files?.videos[video].filename)
    }

    for (var mp3 in req.files?.music) {
        music.push(url + "/music/" + req.files?.music[mp3].filename)
    }
    const post = new Post({
        user: req.body.user,
        kind: req.body.kind,
        location: req.body.location,
        tags: req.body.tags,
        photo: main_photo,
        description: req.body.description,
        title: req.body.title,
        photos: photos,
        videos: videos,
        music: music,
        likedBy: [],
        supportedBy: [],
        comments: []
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: "Post added successfully",
            post: {
                ...createdPost,
                id: createdPost._id,
            }
        });
    })
        .catch(error => {
            res.status(500).json({
                message: "Creating a post failed",
                error: error
            })
        });
}

exports.updatePost = (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");

    var main_photo = req.body.photo;
    var photos = req.body.photos;
    var videos = req.body.videos;
    var music = req.body.music;
    var likedByIDs = [];

    if (req.files?.photo) {
        for (var ph in req.files?.photo) {
            main_photo = url + "/images/" + req.files?.photo[ph].filename;
        }
    }

    if (req.files?.photos) {
        photos = [];
        for (var photo in req.files?.photos) {
            photos.push(url + "/images/" + req.files?.photos[photo].filename)
        }

    }

    if (req.files?.videos) {
        videos = []
        for (var video in req.files?.videos) {
            videos.push(url + "/videos/" + req.files?.videos[video].filename)
        }
    }

    if (req.files?.music) {
        music = []
        for (var mp3 in req.files?.music) {
            music.push(url + "/music/" + req.files?.music[mp3].filename)
        }
    }

    for (var i = 0; i < req.body.likedBy?.length; i++) {
        if (req.body.likedBy[i] != null)
            likedByIDs.push(req.body.likedBy[i]._id)
    }
    // for (var i = 0; i < req.body.supportedBy?.length; i++) {
    //     console.log(req.body.supportedBy[i])
    //     if (req.body.supportedBy[i] != null){
    //         req.body.supportedBy[i].user = req.body.supportedBy[i].user._id
    //     }
    // }
    const post = new Post({
        _id: req.params.id,
        user: req.body.user._id,
        kind: req.body.kind,
        location: req.body.location,
        tags: req.body.tags,
        photo: main_photo,
        description: req.body.description,
        title: req.body.title,
        photos: photos,
        videos: videos,
        music: music,
        likedBy: likedByIDs,
        supportedBy: req.body.supportedBy,
        comments: req.body.comments
    });
    // console.log(req.body)
    Post.updateOne({ _id: req.params.id }, post).populate(populate)
        .then(result => {
            // console.log(result)
            if (result.n > 0) {
                res.status(200).json({
                    message: 'Update successful!',
                    post: post
                });
            } else {
                res.status(401).json({
                    message: 'Not Authorized'
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Updating a post failed"
            })
        });
}

module.exports.updateComments = (req, res, next) => {
    var comment = req.body
    const c =
    {
        user: req.body.user,
        comment: req.body.comment
    }

    console.log(c)
    Post.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comments: { c } } }
    ).populate(populate)
        .then(result => {
            if (result.n > 0) {
                res.status(200).json({
                    message: 'Update successful!'
                });
            } else {
                res.status(401).json({
                    message: 'Not Authorized'
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Updating a post failed",
                error: error
            })
        });
}

exports.deletePost = (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
        .then(result => {
            if (result.n > 0) {
                res.status(200).json({
                    message: 'Post Deleted!'
                });
            } else {
                res.status(401).json({
                    message: 'Not Authorized'
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Delete post failed"
            })
        });
}