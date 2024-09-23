const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const app = express();
const upload = multer({ dest: 'static/' }).any();
const archiver=require('archiver');
const fs=require('fs');
const zlib = require('zlib');

app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Multer storage configuration
const storage = multer.diskStorage({
    destination: 'static',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix   
 + '.mp4'); // Adjust the file extension as needed
    }
});

const uploadvideo = multer({ storage: storage });


app.post('/uploadvideo', uploadvideo.single('video'), (req, res) => {
    if (req.file) {
        console.log(req.file.filename);

        
        const outputFilePath = `sample_video_compressed.mp4`;
        const videoPath= `static/${req.file.filename}`;
        console.log(outputFilePath);
        // Call the compression function here
        compressVideo(videoPath, outputFilePath, res);

    } else {
        res.status(400).send('No video file was uploaded.');
    }
});



  

  
app.post('/compress', uploadvideo.single('video'), (req, res) => {
  
  const inputVideo = req.file.path;
    const outputVideo = `static/${req.file.originalname}_compressed.mp4`;

    ffmpeg(inputVideo)
        .inputOptions(['-ss 00:00:00', '-to 00:01:00']) // Optional: Set start and end times
        .output(outputVideo)
        .run((err, stdout, stderr) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error compressing video');
            } else {
                // Read the compressed video file
                const readStream = fs.createReadStream(outputVideo);

                // Create a Gzip stream
                const gzip = zlib.createGzip();

                // Pipe the read stream through the Gzip stream and send the compressed data
                readStream.pipe(gzip).pipe(res);
            }
        });


});






app.post('/getvideo', (req, res) => {
    if (req.body.videoname) {
        console.log(req.body.videoname);

        
        const outputFilePath = `decompressed_.mp4`;
        const videoPath= `static/${req.body.videoname}`;
        console.log(outputFilePath);
        // Call the compression function here
        decompressVideo(videoPath, outputFilePath, res);

    } else {
        res.status(400).send('No video file was uploaded.');
    }
});



const compressVideo = (inputPath, outputPath, res) => {
  ffmpeg(inputPath)
    .output(path.join('static', outputPath))
    .videoCodec('libx264')
    .size('20%')
    .on('end', () => {
      console.log('Compression completed!');
      res.send('Video uploaded and compressed successfully!');
    })
    .on('error', (err) => {
      console.error('Compression failed:', err);
      res.status(500).send('Compression failed.');
    })
    .run();
};



const decompressVideo = (inputPath, outputPath, res) => {
    ffmpeg(inputPath)
      .output(path.join('static', outputPath))
      .videoCodec('libx264')
      .videoBitrate('2000k')
      .size('100%')
      .on('end', () => {
        console.log('Compression completed!');
        res.send('Video uploaded and decompressed successfully!');
      })
      .on('error', (err) => {
        console.error('Compression failed:', err);
        res.status(500).send('Compression failed.');
      })
      .run();
  };
  

  const zipDirectory = 'static';

app.get('/zip', (req, res) => {
  const fileToZip = 'static/people.mp4'; // Replace with the actual file path
  const zipFilename = 'zippedvideo_file.zip';

  // Create the zip directory if it doesn't exist
  /*
  if (!fs.existsSync(zipDirectory)) {
    fs.mkdirSync(zipDirectory);
  }
*/
  const output = fs.createWriteStream(path.join(zipDirectory, zipFilename));
  //const archive = archiver('zip');
  const archive = archiver('zip', {
    zlib: { level: 9 } // Set compression level (optional)
});
  output.on('close', () => {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized');   


    // Send the zipped file as a response
    res.download(path.join(zipDirectory, zipFilename));
  });

  archive.pipe(output);

  archive.append(fs.readFileSync(fileToZip), { name: path.basename(fileToZip) });
  archive.finalize();
});





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});