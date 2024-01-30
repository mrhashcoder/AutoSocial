const generateVideo = require("./workers/VideoGenrerator");
const generateAudio = require("./workers/audioGenerator");
const generateFrames = require("./workers/frameGenerator");

const create = async (text) => {
  // generate Frames in data folder
  // let { frameCount } = await generateFrames(text);

  let res = await generateAudio(text);

  // let { videoPath } = await generateVideo();

  // return videoPath;
};

const text =
  "Curious how many Whop communities are running VPN arbitrage\n\nTurning on VPN\n\nFinding product\n\nBuying product cheaper\n\nWhop it\nPush to paid Discord communities\nThe average will not realize the opportunity \n\nHuge Cashflow operation if done right\n\nNot legal advice";

create(text);

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
