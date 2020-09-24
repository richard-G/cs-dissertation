var express = require('express');
var router = express.Router();
var conn;
var passport = require('../helpers/passport');

// used if user votes on a comment, OR removes their vote
router.post('/', passport.authenticate('getUser'), async function(req, res, next) {
    if (!req.user) {
        res.status(401).json({success: false, message: 'not logged in'});
    }

    // construct payload
    const data = req.body;     // expected: {commentID}
    // [id, commentID, voterID, role]

    data['voterID'] = req.user.id;
    data['role'] = req.user.role;

  
    conn = require('../helpers/connection');
    const query = `SELECT COUNT(*) FROM votes WHERE voterID = ${req.user.id} AND role = '${req.user.role}' AND commentID = ${data['commentID']}`;
    console.log('first votes query: ', query);
    conn.query(query, function(err, result) {
        if (err) throw err;
        const voteExists = Object.values(JSON.parse(JSON.stringify(result))[0])[0];
        if (!voteExists) {
            // upvote
            req.action = 'giveKudos'
            const query = 'INSERT into votes SET ?';
            conn.query(query, data,
                function(err) {
                    if (err) throw err;
                    res.status(200).json({success: true, message: 'comment upvoted'});
                });
        } else {
            // remove upvote
            req.action = 'removeKudos';
            const query = `DELETE FROM votes WHERE voterID = ${req.user.id} AND commentID = ${data['commentID']}`;
            conn.query(query, function(err) {
                if (err) throw err;
                res.status(200).json({success: true, message: 'comment upvote removed'});
            }) ;
        }
    });



})


module.exports = router;