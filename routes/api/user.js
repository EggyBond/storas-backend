const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const key = require('../../config/keys').secret;
const User = require('../../models').User;

/**
 * @route POST api/users/register
 * @desc Register the User
 * @access Public
 */
router.post('/register', (req, res) => {
    Reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    let {
        fullName,
        email,
        phoneNo,
        password1,
        password2,
        type,
    } = req.body
    if (password1 !== password2) {
        return res.status(401).json({
            success: false,
            errorMessage: "Password does not match.",
            result: null
        });
    } else if (!Reg.test(email)) {
        return res.status(400).json({
            success: false,
            errorMessage: "Please input valid email",
            result: null
        });
    } else {
        // Check for the unique Email
        User.findOne({
            where: {
                email: email
            }
        }).then(user => {
            if (user) {
                return res.status(409).json({
                    success: false,
                    errorMessage: "Email is already registred. Did you forgot your password.",
                    result: null
                });
            } else {
                // Check for the Unique Phone Number
                User.findOne({
                    where: {
                        phoneNo: phoneNo
                    }
                }).then(user => {
                    if (user) {
                        return res.status(409).json({
                            success: false,
                            errorMessage: "Phone number is already registred.",
                            result: null
                        });
                    } else {
                        // Hash the password
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(password1, salt, (err, hash) => {
                                if (err) throw err;
                                // password = hash;
                                User.create({
                                    fullName: fullName,
                                    email: email,
                                    phoneNo: phoneNo,
                                    password: hash,
                                    type: type,
                                    verificationStatus: false
                                }).then(user => {
                                    return res.status(201).json({
                                        success: true,
                                        errorMessage: null,
                                        result: null
                                    });
                                }).catch(err => {
                                    return res.status(500).json({
                                        success: false,
                                        errorMessage: "Unexpected Server Error",
                                        result: null
                                    });
                                });
                            });
                        });
                    }
                });
            }
        })
    }

});

/**
 * @route POST api/users/login
 * @desc Signing in the User
 * @access Public
 */
router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (!user) {
            return res.status(404).json({
                success: false,
                errorMessage: "Email is not found. Please Register",
                result: null
            });
        }
        // If there is user we are now going to compare the password
        bcrypt.compare(req.body.password, user.dataValues.password).then(isMatch => {
            if (isMatch) {
                // User's password is correct and we need to send the JSON Token for that user
                const payload = {
                    id: user.dataValues.id,
                    email: user.dataValues.email,
                    phoneNo: user.dataValues.phoneNo,
                    type: user.dataValues.type
                };
                jwt.sign(payload, key, {
                    expiresIn: 604800
                }, (err, token) => {
                    res.status(200).json({
                        success: true,
                        errorMessage: null,
                        result: {
                            verificationStatus: user.dataValues.verificationStatus,
                            authToken: `${token}`
                        }
                    });
                })
            } else {
                return res.status(404).json({
                    success: false,
                    errorMessage: "Incorrect password.",
                    result: null
                });
            }
        })
    });
});

/**
 * @route GET api/users/userDetail
 * @desc Return the User's Data
 * @access Private
 */
router.get('/userDetail', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    res.status(200).json({
        success: true,
        errorMessage: null,
        result: {
            email: user.email,
            fullName: user.fullName,
            phoneNo: user.phoneNo,
            verificationStatus: user.verificationStatus,
            type: user.type,
        }
    });
});

module.exports = router;