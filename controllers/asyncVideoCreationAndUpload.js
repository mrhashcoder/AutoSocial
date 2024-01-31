const createVideo = require("../workers/initWorker");
const { uploadMedia } = require("../db/dbFunctions");

const createAndUploadMedia = (videoGenObject, signedVideoUrlData, signedThumbnailUrlData) => {
    const content = videoGenObject.content;
    if (content) {
        try {
            createVideo(content).then(async (res) => {
                console.log(res);
                const videoPath = res.videoPath;
                const thumbnailPath = res.firstFramePath;
                if (videoPath) {
                    if (thumbnailPath) {
                        await uploadMedia(videoPath, signedVideoUrlData);
                        await uploadMedia(thumbnailPath, signedThumbnailUrlData);
                        console.log("Video & Thumbnail Upload Success");
                    } else {
                        console.log("Frame Upload Failed");
                    }
                } else {
                    console.log("Video Upload Failed");
                }
            });
        } catch (err) {
            console.log(err);
        }
    } else {
        console.log("Failed!!");
    }
};

module.exports = createAndUploadMedia;
