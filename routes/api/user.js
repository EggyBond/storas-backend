const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const e = require('express');
const key = require('../../config/keys').secret;
const User = require('../../models').User;
const UserOtps = require('../../models').UserOtps;
const mimeTypes = require('mimetypes');
const {v4: UUID} = require('uuid');
const firebaseAdmin = require("../../services/firebaseAdmin");
const nodemailer = require("../../services/nodemailer");

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
                                
                                const storage = firebaseAdmin.storage();
                                const bucket = storage.bucket();
                                var downloadUrl = ""
                                const image = req.body.imagePayload.image,
                                    mimeType = image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1],
                                    fileName = req.body.imagePayload.fileName + new Date().getTime() + "." + mimeTypes.detectExtension(mimeType),
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

                                    downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media&token=${uuid}`;
                                    console.log(downloadUrl)
                                    User.create({
                                        fullName: fullName,
                                        email: email,
                                        phoneNo: phoneNo,
                                        password: hash,
                                        type: type,
                                        verificationStatus: false,
                                        id_picture : downloadUrl
    
                                    }).then(user => {
                                        let otp = generateOTP();
                                        let expiredTime = new Date();
                                        expiredTime.setTime(expiredTime.getTime() + (1*60*60*1000));
                                        UserOtps.create({
                                            userId: user.id,
                                            otp: otp,
                                            expired: expiredTime,
                                        }).then((userOtp)=>{
                                            var mailOptions = {
                                                from: 'storas.id@gmail.com',
                                                to: email,
                                                subject: 'OTP',
                                                text: `Berikut ini adalah otp ${otp}`
                                            };
                                            nodemailer.sendMail(mailOptions, function(error, info){
                                                if (error) {
                                                    console.log(error);
                                                } else {
                                                    console.log('Email sent: ' + info.response);
                                                }
                                            });
                                        })
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
                        });
                    }
                });
            }
        })
    }

});

router.post('/registerAdmin', passport.authenticate('jwt', {
    session: false
}),  (req, res) => {
    Reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    let {
        fullName,
        email,
        phoneNo,
        password1,
        password2,
        type,
    } = req.body

    if (user.type !== 'ADMIN') {
        return res.status(403).json({
            result: null,
            success: false,
            errorMessage: "You're not authorized to use this API."
        });
    }

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
                                    verificationStatus: true,

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
 * @route POST api/users/listAdmin
 * @desc Signing in the User
 * @access Public
 */
router.get('/listAdmin', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    
    if(user.type == "ADMIN"){
        let whereQuery = {};
        whereQuery['type']="ADMIN"
        const users = User.findAll(
            {
                where: whereQuery
            }
        ).then((user) => {
            return res.status(200).json({
                result: {
                    users: user
                },
                success: true,
                errorMessage: null
            });
        });
    }else{
        return res.status(403).json({
            result: null,
            success: false,
            errorMessage: "You're not authorized to use this API."
        });
    }

});

/**
 * @route POST api/users/listAdmin
 * @desc Signing in the User
 * @access Public
 */
router.delete('/deleteAdmin', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    let {
        userId
    } = req.query

    if(user.type != "ADMIN"){
        return res.status(403).json({
            result: null,
            success: false,
            errorMessage: "You're not authorized to use this API."
        });
    }

    if(user.id == userId){
        return res.status(403).json({
            result: null,
            success: false,
            errorMessage: "Cannot delete yourself"
        });
    }

    User.destroy(
        {
            where: { id : userId}
        }
    ).then(() => {
        return res.status(200).json({
            success: true,
            errorMessage: null
        });
    }).catch((err)=>{
        console.log(err)
        return res.status(500).json({
            success: false,
            errorMessage: "Unexpected Server Error",
            result: null
        });
    });
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
                    type: user.dataValues.type,
                    fullName: user.dataValues.fullName,
                    profilePicture: user.dataValues.profile_picture
                };
                jwt.sign(payload, key, {
                    expiresIn: 604800
                }, (err, token) => {
                    res.status(200).json({
                        success: true,
                        errorMessage: null,
                        result: {
                            userData: payload,
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
            userId: user.id,
            email: user.email,
            fullName: user.fullName,
            phoneNo: user.phoneNo,
            verificationStatus: user.verificationStatus,
            type: user.type,
            birthdate: user.birthdate,
            idPicture: user.id_picture,
            profilePicture: user.profile_picture
        }
    });
});

router.post('/editProfile', passport.authenticate('jwt', {
    session: false
}),(req, res) => {
    Reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    let {
        email,
        birthdate,
        fullName,
        profilePicture
    } = req.body
    if (!Reg.test(email)) {
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
        }).then(userEmail => {
            if (userEmail && userEmail.dataValues.email != user.email) {
                return res.status(409).json({
                    success: false,
                    errorMessage: "Email is already registred.",
                    result: null
                });
            } else {
                bcrypt.compare(req.body.password, user.password).then(isMatch => {
                    if (isMatch) {
                        // User's password is correct and we need to send the JSON Token for that user
                        const payload = {
                            id: user.id,
                            email: email,
                            phoneNo: user.phoneNo,
                            type: user.type,
                            fullName: fullName
                        };
                        
                        jwt.sign(payload, key, {
                            expiresIn: 604800
                        }, (err, token) => {
                            User.update({
                                fullName: fullName,
                                email: email,
                                birthdate: birthdate,
                                profile_picture: profilePicture
                            },{
                                where: {
                                  id: user.id
                                }
                                }).then(user => {
                                return res.status(200).json({
                                    success: true,
                                    errorMessage: null,
                                    result: {
                                        userData: payload,
                                        authToken: `${token}`
                                    }
                                });
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
                // Check for the Unique Phone Number
                
            }
        })
    }

});

router.post('/changePassword', passport.authenticate('jwt', {
    session: false
}),(req, res) => {
    Reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    let {
        oldpassword,
        password1,
        password2,
    } = req.body
    if (password1 !== password2) {
        return res.status(401).json({
            success: false,
            errorMessage: "Password does not match.",
            result: null
        });
    } else {

        bcrypt.compare(req.body.oldpassword, user.password).then(isMatch => {
            if (isMatch) {
                // User's password is correct and we need to send the JSON Token for that user
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password1, salt, (err, hash) => {
                        if (err) throw err;
                        const payload = {
                            id: user.id,
                            email: user.email,
                            phoneNo: user.phoneNo,
                            type: user.type,
                            fullName: user.fullName
                        };

                        jwt.sign(payload, key, {
                            expiresIn: 604800
                        }, (err, token) => {
                            User.update({
                                password: hash,
                            },{
                                where: {
                                  id: user.id
                                }
                                }).then(user => {
                                return res.status(201).json({
                                    success: true,
                                    errorMessage: null,
                                    result: {
                                        userData: payload,
                                        authToken: `${token}`
                                    }
                                });
                            }).catch(err => {
                                console.log(err)
                                return res.status(500).json({
                                    success: false,
                                    errorMessage: "Unexpected Server Error",
                                    result: null
                                });
                            });
                            
                        })
                        
                    });
                });
            } else {
                return res.status(404).json({
                    success: false,
                    errorMessage: "Incorrect password.",
                    result: null
                });
            }
        })
        // Check for the unique Email
        
    }

});

function generateOTP() { 
          
    // Declare a digits variable  
    // which stores all digits 
    var digits = '0123456789'; 
    let OTP = ''; 
    for (let i = 0; i < 6; i++ ) { 
        OTP += digits[Math.floor(Math.random() * 10)]; 
    } 
    return OTP; 
} 

router.get('/resendOtp', passport.authenticate('jwt', {
    session: false
}),(req, res) => {
    UserOtps.findOne({
        where: {
            id: user.id
        }
    }).then(otp => {
        var return_otp = "";
        if(otp){
            return_otp = otp.dataValues.otp;
        }else{
            let otp = generateOTP();
            let expiredTime = new Date();
            expiredTime.setTime(expiredTime.getTime() + (1*60*60*1000));
            UserOtps.create({
                userId: user.id,
                otp: otp,
                expired: expiredTime,
            }).catch(err => {
                return res.status(500).json({
                    success: false,
                    errorMessage: "Unexpected Server Error",
                    result: null
                });
            });
            return_otp = otp;
        }
        var mailOptions = {
            from: 'storas.id@gmail.com',
            to: user.email,
            subject: 'OTP',
            text: `Berikut ini adalah otp ${return_otp}`
        };
        nodemailer.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                return res.status(400).json({
                    success: false,
                    errorMessage: "error sending otp",
                });
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        return res.status(200).json({
            success: true,
            errorMessage: null,
        });
    })
    

});

router.post('/verifyOtp', passport.authenticate('jwt', {
    session: false
}),(req, res) => {
    let {
        otp
    } = req.body
    
    UserOtps.findOne({
        where: {
            userId: user.id
        }
    }).then(userOtp => {
        if(userOtp){
            if(otp == userOtp.dataValues.otp){
                User.update({
                    verificationStatus: true,
                },{
                    where: {
                      id: user.id
                    }
                    }).then(user => {
                    return res.status(200).json({
                        success: true,
                        errorMessage: null
                    })
                });
            }else{
                return res.status(400).json({
                    success: false,
                    errorMessage: "Wrong OTP",
                    result: null
                });
            }
        }else{
            return res.status(400).json({
                success: false,
                errorMessage: "Wrong OTP",
                result: null
            });
        }
    }).catch(err => {
        console.log(err)
        return res.status(500).json({
            success: false,
            errorMessage: "Unexpected Server Error",
            result: null
        });
    });
    

});

module.exports = router;