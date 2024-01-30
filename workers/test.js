const ffmpeg = require("fluent-ffmpeg");

const path = require("path");

function changePitch(inputFile, outputFile, pitch, callback) {
    let speed = 1.3;
    const filter = `atempo=${speed},asetrate=44100*${pitch}`;
    ffmpeg(inputFile)
        .audioFilters(filter)
        .save(outputFile)
        .on("end", function () {
            console.log("Pitch changed successfully");
            callback(null);
        })
        .on("error", function (err) {
            console.error("Error: " + err.message);
            callback(err);
        });
}

// Example usage
const inputFile = path.join(__dirname, "..", "data", "audio.mp3");
const outputFile = "output_audio_pitch_changed.wav";
const pitch = 0.42; // Adjust the pitch factor as needed

changePitch(inputFile, outputFile, pitch, function (err) {
    if (err) {
        console.error("Error occurred: " + err.message);
    } else {
        console.log(`Pitch of ${inputFile} changed and saved as ${outputFile}`);
    }
});
