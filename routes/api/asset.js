const express = require('express');
const router = express.Router();
const passport = require('passport');
const mimeTypes = require('mimetypes');
const {v4: UUID} = require('uuid');
const firebaseAdmin = require("../../services/firebaseAdmin");

/**
 * @route GET api/app/asset/upload
 * @desc Get transaction detail
 * @access Private
 */

router.post('/upload', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {

    const storage = firebaseAdmin.storage();
    const bucket = storage.bucket();

    const image = req.body.image,
        mimeType = image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1],
        fileName = user.id + "-" + req.body.fileName + new Date().getTime() + "." + mimeTypes.detectExtension(mimeType),
        base64EncodedImageString = image.replace(/^data:image\/\w+;base64,/, ''),
        imageBuffer = Buffer.from(base64EncodedImageString, 'base64');

    // Upload the image to the bucket
    const file = bucket.file('asset/images/' + fileName);

    const uuid = UUID();
    file.save(imageBuffer, {
        metadata: {
            contentType: mimeType,
            firebaseStorageDownloadTokens: uuid
        },
        public: true
    }, async function (error) {
        if (error) {
            return res.status(500).json({
                success: false,
                errorMessage: "Unable to upload image"
            });
        }

        const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media&token=${uuid}`;

        return res.status(200).json({
            result: {
                url: downloadUrl
            },
            success: true,
            errorMessage: null
        });
    });
});

module.exports = router;
