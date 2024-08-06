import express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
app.use(express.json());

// Post methods happens when client makes a request to process a video
app.post("/process-video", (req, res) => {
    // Get path of the input video file from the request body
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    // Checks if the file paths are valid and returns a status if invalid
    if (!inputFilePath || !outputFilePath) {
        res.status(400).send("Bad Request: Missing file path.");
    }

    // Video processing
    ffmpeg(inputFilePath)
        .outputOptions("-vf", "scale=-1:360") // 360p
        .on("end", () => { // Sends status 200 and message on successful completion
            res.status(200).send("Processing finished successfully.")
        })
        .on("error", (err) => { // Sends error message and status 500 on error
            console.log(`An error occurred: ${err.message}`);
            res.status(500).send(`Internal Server Error: ${err.message}`);
        })
        .save(outputFilePath); // Saves the video output to the outputFilePath
});

// Port number can be provided as an environment variable
// Defaults to 3000 if not port number was provided
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Video processing service listening at http://localhost:${port}`);
});

