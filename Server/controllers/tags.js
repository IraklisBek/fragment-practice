const Tag = require("../models/tag")

exports.getTags = (req, res, next) => {
    Tag.find()
        .then(tags => {
            res.status(200).json({
                tags: tags
            })
        })
        .catch(err => {
            res.status(500).json({
                message: err
            })
        })
}

exports.addTag = (req, res, next) => {
    const tag = new Tag({
        name: req.body.name
    })
    tag.save()
        .then(createdTag => {
            res.status(201).json({
                tag: createdTag
            })
        })
        .catch(err => {
            res.status(500).json({
                message: err
            })
        })
}

exports.getTagByName = (req, res, next) => {
    Tag.findOne({ name: req.params.name }).then(tag => {
        if (tag) {
            res.status(200).json(tag);
        } else {
            res.status(404).json({ message: 'Tag not found!' });
        }
    })
        .catch(error => {
            res.status(500).json({
                message: "Fetching tag failed"
            })
        });
}

exports.deleteTag = (req, res, next) => {
    Tag.deleteOne({ _id: req.params.id })
        .then(result => {
            res.status(200).json({
                message: 'Post Deleted!'
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Delete post failed"
            })
        });
}

exports.deleteTagByName = (req, res, next) => {
    Tag.deleteOne({ name: req.params.name })
        .then(result => {
            res.status(200).json({
                message: 'Tag Deleted!'
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Delete tag failed"
            })
        });
}