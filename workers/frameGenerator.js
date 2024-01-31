const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

const backgroundImage = path.join(__dirname, "..", "public", "background.png");

const startY = 630;
const endY = 1700;
const padding = 10;
const fontSize = 65;
const marginX = 110;
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1920;
const frameDuration = 100;

const getParagraphY = (text, ctx) => {
    const widthX = CANVAS_WIDTH - marginX - marginX;
    return (ctx.measureText(text).width / widthX) * fontSize;
};

const processText = (text, ctx) => {
    let lines = text.split("\n");
    lines = lines.filter((line) => line.trim() !== "");

    // setting and generation words.
    let words = [];
    let counter = 0;
    for (let i = 0; i < lines.length; i++) {
        let lineWords = lines[i].split(" ");
        lineWords = lineWords.filter((word) => word !== "");

        for (let j = 0; j < lineWords.length; j++) {
            words.push({
                word: lineWords[j],
                sId: counter++,
                paraId: i,
                pageId: null,
            });
        }
    }

    // setting pagenumbers on words.
    let currentY = startY;
    let currentPageId = 0;
    for (let i = 0; i < lines.length; i++) {
        let currentPara = lines[i];
        let neededY = getParagraphY(currentPara, ctx);
        if (currentY + neededY <= endY) {
            currentY += neededY;
            currentY += fontSize + padding * 5;
        } else {
            currentY = startY;
            currentPageId++;
        }
        for (let j = 0; j < words.length; j++) {
            if (words[j].paraId === i) {
                words[j].pageId = currentPageId;
            }
        }
    }

    return words;
};

const renderParagraph = async (ctx, wordsToRender, wordToHighlight, currentY) => {
    let currentX = marginX;
    const promistForWords = [];
    for (let i = 0; i < wordsToRender.length; i++) {
        if (wordsToRender[i].sId === wordToHighlight.sId) {
            ctx.fillStyle = "red";
        } else {
            ctx.fillStyle = "white";
        }
        let res = await ctx.fillText(wordsToRender[i].word, currentX, currentY);
        promistForWords.push(res);
        currentX += ctx.measureText(wordsToRender[i].word + " ").width;
        if (
            i + 1 < wordsToRender.length &&
            currentX + ctx.measureText(wordsToRender[i + 1].word + " ").width > CANVAS_WIDTH - marginX
        ) {
            currentY += fontSize + padding;
            currentX = marginX;
        }
    }
    currentY += fontSize + padding * 7;

    return currentY;
};

const generateFrameFor = async (idx, wordsData, ctx, background) => {
    const wordToHighlight = wordsData[idx];
    const pageToRender = wordToHighlight.pageId;
    const paragraphsToRender = [
        ...new Set(
            wordsData.map((wordData) => {
                if (wordData.pageId === pageToRender) {
                    return wordData.paraId;
                }
            })
        ),
    ].filter((paraId) => paraId !== undefined);

    const wordsToRender = wordsData.map((wordData) => {
        if (wordData.pageId === pageToRender) {
            return wordData;
        }
    });

    let currentY = startY;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    for (let i = 0; i < paragraphsToRender.length; i++) {
        const currentParagraph = paragraphsToRender[i];
        let wordsForCurrentParagraph = wordsData.filter((wordData) => {
            return wordData.paraId === currentParagraph;
        });

        currentY = await renderParagraph(ctx, wordsForCurrentParagraph, wordToHighlight, currentY);
    }
};

const generateFrames = async (text) => {
    const canvas = createCanvas(1080, 1920);
    const ctx = canvas.getContext("2d");
    ctx.font = `${fontSize}px Times New Roman`;
    ctx.fillStyle = "white";

    const wordsData = processText(text, ctx);
    console.log(wordsData);
    const background = await loadImage(backgroundImage);
    const frameCount = wordsData.length;

    for (let i = 0; i < frameCount; i++) {
        generateFrameFor(i, wordsData, ctx, background);
        const fileName = "./public/Frame_" + ("" + i).padStart(5, "0") + ".png";
        const out = fs.createWriteStream(fileName);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on("finish", () => {
            console.log(`Frame Generation for ${i} Completed`);
        });

        await new Promise((resolve) => setTimeout(resolve, frameDuration));
    }
    let firstFramePath = path.join(__dirname, "..", "public", "Frame_00000.png");

    return { frameCount, firstFramePath };
};
/*

const TEXT =
    "Curious how many Whop communities are running VPN arbitrage\n\nTurning on VPN\n\nFinding product\n\nBuying product cheaper\n\nWhop it\nPush to paid Discord communities\nThe average will not realize the opportunity \n\nHuge Cashflow operation if done right\n\nNot legal advice";

generateFrames(TEXT)
    .then((res) => {
        console.log("Done");
    })
    .catch((err) => {
        console.log("ERROR", err);
    });
    
    
*/

module.exports = generateFrames;
