const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const zlib = require('zlib');
const hbjs = require('handbrake-js');
const upload = multer({ dest: 'static/' });
app=express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.post('/compress', upload.single('video'), (req, res) => {
    const inputVideo = req.file.path;
    const outputVideo = `static/${req.file.originalname}.compressed.mp4`;

    hbjs.compress({
        input: inputVideo,
        output: outputVideo,
        preset: 'Very Fast 1080p', // Replace with your desired preset
        encoder: 'x264', // Optional: Specify encoder
        rate: '25', // Optional: Set frame rate
        vb: '1000k', // Optional: Set video bitrate
        optimize: true, // Optional: Enable optimization
        verbose: true // Optional: Enable verbose output
    }, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error compressing video');
        } else {
            res.json({ message: 'Video compressed successfully', outputVideo });
        }
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});