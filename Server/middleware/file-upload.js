const multer = require("multer");

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'video/mp4': 'mp4',
    'audio/mpeg': 'mp3',
    'audio/x-mpeg': 'mp3',
    'audio/mp3': 'mp3',
    'audio/x-mp3': 'mp3',
    'audio/mpeg3': 'mp3',
    'audio/x-mpeg3': 'mp3',
    'audio/x-mpeg-3': 'mp3',
    'audio/mpg': 'mp3',
    'audio/x-mpg': 'mp3',
    'audio/x-mpegaudio': 'mp3',
    'video/mpeg': 'mp3',
    'video/x-mpeg': 'mp3',
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        let destination = "media";
        if (isValid) {
            error = null;
        }
        console.log(file.mimetype)
        if (file.mimetype == "video/mp4") {
            destination = "videos";
        }
        else if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            destination = "images";
        }
        else { //NEED IF STATEMENT.. THIS IS MPAKALIA
            destination = "music";
        }
        cb(error, destination); //the path is relative with where server.js is

    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});


// const MIME_TYPE_MAP_VIDEO = {
//     'video/mp4': 'mp4'
// }

// const storageVideos = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const isValid = MIME_TYPE_MAP_VIDEO[file.mimetype];
//         console.log(file.mimetype)
//         let error = new Error('Invalid mime type');
//         if (isValid) {
//             error = null;
//         }
//         cb(null, "videos"); //the path is relative with where server.js is
//     },
//     filename: (req, file, cb) => {
//         const name = file.originalname.toLowerCase().split(' ').join('-');
//         const ext = MIME_TYPE_MAP_VIDEO[file.mimetype];
//         cb(null, name + '-' + Date.now() + '.' + ext);
//     }
// });

module.exports = {
    photos: multer({ storage: storage }).fields([{
        name: 'photo', maxCount: 1
    }, {
        name: 'photos', maxCount: 10
    }, {
        name: 'videos', maxCount: 10
    }, {
        name: 'music', maxCount: 10
    }]),
    // videos: multer({ storage: storageVideos }).fields([{
    //     name: 'videos', maxCount: 10
    // }])
};