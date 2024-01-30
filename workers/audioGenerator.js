const { TextToSpeechClient } = require("@google-cloud/text-to-speech").v1beta1;
const fs = require("fs");
const util = require("util");
const pausetime = "0.4s";
const outputFile = "data/audio.mp3";

const mergeSmml = (smmlWords) => {
    let addedSmmlWords = "";
    for (let word of smmlWords) {
        addedSmmlWords += word;
    }
    return `<speak>${addedSmmlWords}</speak>`;
};

const ssmlModification = (text) => {
    const words = text.split(/[\s\n]+/);
    let ssmlWords = words.map((word, idx) => {
        return `${word} <mark name='timestamp_${idx}' />`;
    });

    const lines = text.split("\n");
    console.log(lines);
    let breaks = lines.map((line) => {
        if (line == "") {
            return 0;
        }
        let wordInLine = line.split(" ");
        wordInLine = wordInLine.filter((word) => word !== "");
        console.log(wordInLine + " -> " + wordInLine.length);
        return wordInLine.length;
    });

    console.log(words);

    const breakpoints = breaks.filter((item) => item !== 0);

    let itr = 0;
    console.log(breakpoints);
    for (let i = 0; i < breakpoints.length; i++) {
        itr += breakpoints[i];
        if (itr >= ssmlWords.length) {
            break;
        }
        ssmlWords[itr] = `<break time='${pausetime}'/>` + ssmlWords[itr];
    }
    console.log(ssmlWords);
    return ssmlWords;
};

const generateAudio = async (text) => {
    const ssmlWords = ssmlModification(text);
    const finalSmmlData = mergeSmml(ssmlWords);
    console.log(finalSmmlData);

    const client = new TextToSpeechClient();

    const request = {
        input: { ssml: finalSmmlData },
        voice: {
            languageCode: "en-US",
            name: "en-US-Wavenet-J",
        },
        audioConfig: {
            audioEncoding: "LINEAR16",
            effectsProfileId: ["small-bluetooth-speaker-class-device"],
            pitch: -12,
            speakingRate: 0.93,
        },
        enableTimePointing: [1],
    };
    const [response] = await client.synthesizeSpeech(request);
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(outputFile, response.audioContent, "binary");

    let timestamps = response.timepoints.map((timePoint) => {
        return timePoint.timeSeconds;
    });

    console.log("TimeStamps Count : ", timestamps.length);

    return { timestamps };
};

module.exports = generateAudio;
