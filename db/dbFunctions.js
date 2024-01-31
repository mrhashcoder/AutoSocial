const supabase = require("./supabase");
const fs = require("fs");
const config = require("../config");

async function uploadMedia(filePath, signedUrlData) {
    const mediaFile = await fs.readFileSync(filePath);

    if (mediaFile) {
        const { data, error } = await supabase.storage
            .from(config.STORAGE_BUCKET_NAME)
            .uploadToSignedUrl(signedUrlData.path, signedUrlData.token, mediaFile);
    } else {
        return "failed to upload video";
    }
}

async function createSignedUrl(fileName, folder) {
    const { data, error } = await supabase.storage
        .from(config.STORAGE_BUCKET_NAME)
        .createSignedUploadUrl(`${folder}/${fileName}`);

    if (error) {
        return "failed";
    }

    return data;
}

async function createDbObject(videoGenData) {
    const { data, error } = await supabase.from("autosocial").insert(videoGenData).select();
    if (error) {
        console.log(error);
        return "failed";
    } else {
        return data;
    }
}

function createPublicUrl(fileName, folder) {
    const url = config.SUPABASE_URL + "/storage/v1/object/public/" + config.STORAGE_BUCKET_NAME + "/" + fileName;
    return url;
}

module.exports = { uploadMedia, createSignedUrl, createDbObject, createPublicUrl };
