require('dotenv').config();

const path = require("path");
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const postsRoutes = require("./routes/posts")
const authRoutes = require("./routes/auth")
const tagRoutes = require("./routes/tags")
const userRoutes = require("./routes/users")
const notificationRoutes = require("./routes/notifications")

const app = express();

// mongoose.connect("mongodb+srv://bekiaris:NA5QOwiZh3eZQAyf@cluster0.2wlci.mongodb.net/fragment?retryWrites=true&w=majority"
//     , {
//         useUnifiedTopology: true,
//         useNewUrlParser: true,
//         useFindAndModify: false
//     })
//     .then(() => {
//         console.log("Connected to Database");
//     })
mongoose.connect("mongodb://localhost:27017/fragment", { useFindAndModify: false })
    .then(() => {
        console.log("Connected to Database");
    })
    .catch((e) => {
        console.log(e)
        console.log("Connection Failed")
    });


var fs = require('fs');
var dirImages = './images';
var dirVideos = './videos';
var dirMusic = './music';
var dirMedia = './media';

if (!fs.existsSync(dirImages)) {
    fs.mkdirSync(dirImages);
}

if (!fs.existsSync(dirVideos)) {
    fs.mkdirSync(dirVideos);
}

if (!fs.existsSync(dirMusic)) {
    fs.mkdirSync(dirMusic);
}

if (!fs.existsSync(dirMedia)) {
    fs.mkdirSync(dirMedia);
}


app.use(bodyParser.json());
app.use("/images", express.static(path.join("images")));//give access to iamges to the frontend
app.use("/videos", express.static(path.join("videos")));
app.use("/media", express.static(path.join("media")));
app.use("/music", express.static(path.join("music")));

app.use((req, res, next) => { //no filter, e.g. /api/posts cause i am doing it for all requests
    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, PUT, OPTIONS"
    );
    next();//we use next if we are not returning a response
});

app.get('/', function (req, res) {
    res.send('hello world');
});
app.use("/api/posts", postsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

module.exports = app;