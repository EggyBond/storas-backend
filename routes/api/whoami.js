const express = require('express');
const router = express.Router();

/**
 * @route POST api/users/login
 * @desc Signing in the User
 * @access Public
 */
router.get('/whoami', (req, res) => {
    return res.status(200).json({
        success: true,
        msg: "You're Welcome :)"
    });
});

module.exports = router;