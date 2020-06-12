const express = require('express');
const router = express.Router();
const Nexmo = require('nexmo');
const passport = require('passport');
const key = require('../../config/keys').secret;
const User = require('../../models').User;
const keyApiKey = require('../../config/keys').apiKey;
const keyApiSecret = require('../../config/keys').apiSecret;

const nexmo = new Nexmo({
    apiKey: keyApiKey,
    apiSecret: keyApiSecret,
});

/**
 * @route POST api/users/register
 * @desc Register the User
 * @access Private
 */
router.post('/verifyPhoneNumber', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    nexmo.verify.check({
        request_id: req.body.request_id,
        code: req.body.code
    }, (err, result) => {
        if (result.error_text) {
            res.status(400).json({success: false, errorMessage: "Invalid Verification Number", result: null})
        } else {
            console.log(err ? err : result);
            User.update(
                {
                    verificationStatus: true
                }, {
                    where: {
                        phoneNo: user.phoneNo
                    }
                }
            ).then(() => {
                res.status(201).json({success: true, errorMessage: null, result: null})
            }).catch(err => {
                res.status(500).json({success: false, errorMessage: "Unexpected Server Error", result: null})
            })
        }
    });
})

/**
 * @route POST api/users/register
 * @desc Register the User
 * @access Private
 */
router.get('/requestVerification', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    nexmo.verify.request({
        number: user.phoneNo,
        brand: '[STORAS]',
        code_length: '4',
        workflow_id: 6,
        pin_expiry: 60,
    }, (err, result) => {
        User.findOne({
            where: {
                phoneNo: user.phoneNo
            }
        }).then(user => {
            if (user.dataValues.verificationStatus === true) {
                return res.status(409).json({
                    success: false,
                    errorMessage: "Phone number is already verified.",
                    result: null
                });
            } else {
                res.status(200).json({success: true, errorMessage: null, result: {request_id: result.request_id}})
            }
        });
        console.log(result);
        console.log(err);
    });
});

module.exports = router;