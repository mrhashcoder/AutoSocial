const generateVideo = require("./workers/videoGenrerator");
const generateAudio = require("./workers/audioGenerator");
const generateFrames = require("./workers/frameGenerator");

const create = async (text) => {
    // generate Frames in data folder
    console.log("Frame Generation in progress....");
    let frameCount = await generateFrames(text);

    console.log("Audio Generation in progress....");
    let { timestamps } = await generateAudio(text);

    console.log(frameCount);
    console.log(timestamps);

    console.log("Video Generation in progress....");
    let { videoPath } = await generateVideo(frameCount, timestamps);

    return videoPath;
};

const text =
    "Curious how many Whop communities are running VPN arbitrage\n\nTurning on VPN\n\nFinding product\n\nBuying product cheaper\n\nWhop it\nPush to paid Discord communities\nThe average will not realize the opportunity \n\nHuge Cashflow operation if done right\n\nNot legal advice";

create(text)
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.error("Error", err);
    });

/**
Curious how many Whop communities are running VPN arbitrage

Turning on VPN

Finding product

Buying product cheaper

Whop it

Push to paid Discord communities

The average will not realize the opportunity 

Huge Cashflow operation if done right

Not legal advice
 */
