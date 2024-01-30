const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");

const frameFolderPath = path.join(__dirname, "..", "data");
const audioFile = path.join(__dirname, "..", "data", "audio.mp3");
const outputFile = path.join(__dirname, "..", "data", "output.mp4");

const generateVideo = async (frameCount, timeStamps) => {
    const frames = fs.readdirSync(frameFolderPath).filter((file) => file.endsWith(".png"));
    const command = ffmpeg(audioFile).audioCodec("mp2fixed");

    for (let i = 0; i < frameCount; i++) {
        let inputOptionsData = ["-loop 1"];
        let duration = 0;
        if (i == 0) {
            duration = timeStamps[i];
        } else {
            duration = timeStamps[i] - timeStamps[i - 1];
        }
        inputOptionsData.push(`-t ${duration}`);

        command.input(`${frameFolderPath}/${frames[i]}`).inputOptions(inputOptionsData);
    }

    command.input(audioFile);

    command.complexFilter([{ filter: "concat", options: { n: frameCount, v: 1, a: 0 } }]);

    command.videoCodec("libx264").audioCodec("libmp3lame").outputOptions("-pix_fmt yuv420p").outputOptions("-r 60");

    // Set the output file
    command.output(outputFile);

    command
        .on("error", function (err) {
            console.error("An error occurred: " + err.message);
        })
        .on("end", function () {
            console.log("Processing finished !");
        })
        .run();

    return { videoPath: outputFile };
};

module.exports = generateVideo;
