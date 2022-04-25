
const Post= require("../models/post.model");
const mongoose = require("mongoose");
const jsonschema = require("jsonschema");


module.exports.list = (req, res, next ) => {

    Post.find({}, (err, posts) => {
        if (err) {
            res.status(500).json({
                message: "Internal server error"
            });
            return;
        }
        res.status(200).json({
            message: "Posts listed",
            posts: posts
        });
    });
};

module.exports.detail = (req, res, next ) => {

    const id = req.params.id;
    Post.findById(id, (err, post) => {
        if (err) {
            res.status(500).json({
                message: "Internal server error"
            });
            return;
        }
        if (!post) {
            res.status(404).json({
                message: "Post not found"
            });
            return;
        }
        res.status(200).json({
            message: "Post Details",
            post: post
        });
        next();
    });
};

module.exports.create = (req, res, next ) => {

  const data = ({title, text, author} = req.body);
    const schema = {
        type: "object",
        required: ["title", "text", "author"],
        properties: {
            title: {
                type: "string",                
                maxLength: 50
            },
            text: {
                type: "string",
                maxLength: 50
            },
            author: {
                type: "string",
                maxLength: 50
            }
        }
    };
 
     const validator = new jsonschema.Validator();
        const result = validator.validate(data, schema);
        if (req.get("Content-Type") !== "application/json") {
            res.status(400).json({
                message: "Content-Type must be application/json"
            });
            return;
        }
        if (!result.valid) {
            res.status(400).json({
                message: "Not a valid request  " + result.errors
            });
            return;
        }
        const post = new Post({
            title: title,
            text: text,
            author: author
        });
        if (schema.required) {
            for (let i = 0; i < schema.required.length; i++) {
                if (!data[schema.required[i]]) {
                    res.status(400).json({
                        message: "Missing required field: " + schema.required[i]
                    });
                    return;
                }
            }
        }
        Post.create (post, (err, post) => {
            if (err) {
                res.status(500).json({
                    message: "Internal server error"
                });
                return;
            }
            res.status(201).json({
                message: "Post created",    
                post: post

            });
        });
};

module.exports.update = (req, res, next ) => {
    const id = req.params.id;
    const data = ({title, text, author} = req.body);
        
    Post.findByIdAndUpdate(id, data,  {
        new: true
    }, (err, post) => {
        if (err) {
            res.status(500).json({
                message: "Internal server error"
            });
            return;
        }
        if (!post) {
            res.status(404).json({
                message: "Post not found"
            });
            return;
        }
        res.status(200).json({
            message: "Post updated",
            post: post
        });
        next(err);
    });
};

module.exports.delete = (req, res, next ) => {

    const id = req.params.id;
    Post.findByIdAndDelete(id, (err, post) => {
        if (err) {
            res.status(500).json({
                message: "Internal server error"
            });
            return;
        }
        if (!post) {
            res.status(404).json({
                message: "Post not found"
                           

            });
            return;
        }
        res.status(204).json({
            message: "Post deleted",
            post : post
        });
        next();
    });

};

