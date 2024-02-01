const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");

const frameFolderPath = path.join(__dirname, "..", "public");
const audioFile = path.join(__dirname, "..", "public", "audio.mp3");
const outputFile = path.join(__dirname, "..", "public", "output.mp4");

const generateVideo = async (frameCount, timeStamps) => {
    const frames = fs.readdirSync(frameFolderPath).filter((file) => file.endsWith(".png"));
    const command = ffmpeg();

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

    const pitch = 0.42;
    const speed = 1.3;
    const filter = `atempo=${speed},asetrate=44100*${pitch}`;
    // command.input(audioFile).audioFilters(filter);

    command.complexFilter([{ filter: "concat", options: { n: frameCount, v: 1, a: 0 } }]);

    command.videoCodec("libx264").audioCodec("libmp3lame").outputOptions("-pix_fmt yuv420p").outputOptions("-r 60");

    // Set the output file
    command.output(outputFile);
    let isProcessComplete = false;

    async function onEnd() {
        console.log("Video Generation finished");
        isProcessComplete = true;
    }

    let totalExpectedTime = 1;

    command
        .on("error", function (err) {
            console.error("An error occurred: " + err.message);
            return new Error("An error occurred: " + err.message);
        })
        .on("end", onEnd)
        .on("codecData", (data) => {
            console.log(data);
            totalExpectedTime = parseInt(data.duration.replace(/:/g, ""));
            console.log(`Total Expected Time for Video generation : ${totalExpectedTime}`);
        })
        .on("progress", (progress) => {
            console.log(`In Progress`);
            console.log(progress);
        })
        .run();

    function waitForProcessToComplete() {
        return new Promise((resolve, reject) => {
            setInterval(() => {
                if (isProcessComplete === true) {
                    resolve();
                    return isProcessComplete;
                }
            }, 100); // Polling in 100ms
        });
    }

    await waitForProcessToComplete();
    console.log("Returning Video Path", outputFile);
    const videoPath = outputFile;
    return { videoPath };
};

module.exports = generateVideo;
