const express = require("express");
const crypto = require("crypto");
const { createSignedUrl, createDbObject, createPublicUrl } = require("../db/dbFunctions");
const path = require("path");
const createAndUploadMedia = require("../controllers/asyncVideoCreationAndUpload");

const router = express.Router();

router.post("/create", async (req, res) => {
    try {
        const videoGenData = {
            id: crypto.randomBytes(4).toString("hex"),
            content: req.body.content,
            title: req.body.title,
            tags: req.body.tags,
        };

        const _id = Date.now();

        const videoFileName = `${_id}.mp4`;
        const signedVideoUrlData = await createSignedUrl(videoFileName, "videos");

        const thumbnailFileName = `${_id}.png`;
        const signedThumbnailUrlData = await createSignedUrl(thumbnailFileName, "thumbnails");

        if (!signedVideoUrlData === "failed") {
            return res.status(403).json({
                message: "Issue With Database",
            });
        }

        console.log(signedVideoUrlData);

        const videoGenObject = {
            id: _id,
            title: videoGenData.title,
            content: videoGenData.content,
            tags: videoGenData.tags,
            videoUrl: createPublicUrl(signedVideoUrlData.path),
            thumbnailUrl: createPublicUrl(signedThumbnailUrlData.path),
        };

        const dbObject = await createDbObject(videoGenObject);

        // create a signed URL and submit the object to the db tables

        // const videoPath = await videoGenWorker(videoGenData.content);

        // const videoPath = path.join(__dirname, "..", "public", "output.mp4");
        // const thumbnailPath = path.join(__dirname, "..", "public", "Frame_00000.png");

        createAndUploadMedia(videoGenObject, signedVideoUrlData, signedThumbnailUrlData);

        return res.status(200).json({
            message: "Success",
            data: dbObject,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: "failed",
            message: "EROOR AT SERVER SIDE",
            data: null,
        });
    }
});

router.get("/", async (req, res) => {
    return res.status(200).json({ message: "Active" });
});

module.exports = router;
