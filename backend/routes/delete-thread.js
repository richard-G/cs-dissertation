var express = require('express');
var router = express.Router();
var conn;
var passport = require('../helpers/passport');

// POST, used if an academic DELETES a thread
router.post('/', passport.authenticate('getUser'), async function(req, res, next) {
    // ensure user is logged in
    if (!req.user) {
        res.status(401).json({success: false, message: 'not logged in'});
    } else {
        
    }

    if (!(req.user.role === 'academic')) {
        res.status(403).json({success: false, message: 'not authorized to make this request.'})
    } else {
        // construct the payload, title and moduleID should be attached to the req body   req.body = {threadID}
        const data = req.body;

        const threadID = data['threadID'];

        conn = require('../helpers/connection');
        conn.query(`DELETE FROM threads WHERE threadID = ${threadID}`,
            function(err, result) {
                if (err) throw err;

                console.log('deleted from threads table thread ID: ', threadID);
                res.status(200).json({success: true, message: 'thread deletion successful.'});
            });
    }

});


module.exports = router;
