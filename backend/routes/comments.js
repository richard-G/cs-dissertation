var express = require('express');
var router = express.Router();
var conn;
var passport = require('../helpers/passport');

// returns a list of all of the comments linked to a given threadID, as well as poster first_name, last_name
router.get('/:threadID', passport.authenticate('getUser'), async function(req, res, next) {
    // ensure user is logged in
    if (!req.user) {
        return res.send('not logged in');
    } else {

    }
    req.action = 'loadThreadComments';

    // connect to the db
    conn = require('../helpers/connection');
    // construct db query
    const threadID = req.params.threadID;
    const query = `SELECT * FROM comments WHERE threadID = ${threadID}`;
    conn.query(query, function(err, result) {
        if (err) throw err;

        const comments = JSON.parse(JSON.stringify(result));

        // res.send(result);
        constructPromises(comments)
            .then(data => {
                console.log('comments: ', data);
                res.send(data);
            })
    });
});


// POST, used if a user posts a comment
router.post('/', passport.authenticate('getUser'), async function(req, res, next) {
    // ensure user is logged in
    if (!req.user) {
        res.status(401).json({success: false, message: 'not logged in'});
    } 
    req.action = 'makeThreadComment';

    // construct the payload.   req.body = {threadID, text, parentID}
    const data = req.body;
    data['role'] = req.user.role;
    // convert timestamp to the datatype MySQL accepts
    data['timestamp'] = new Date().toISOString().slice(0, 19).replace('T', ' '); 
    data['posterID'] = req.user.id;

    conn = require('../helpers/connection');
    conn.query('INSERT into comments SET ?', data,
        function(err, result) {
            if (err) throw err;
            // console.log('inserted into comments table: ', data);
            res.status(200).json({success: true, message: 'comment successful.'});
        });
});


// appends poster info for each comment
function getPosterInfo(comment) {
    const table = comment.role === 'student' ? 'students' : 'academics';
    const field = comment.role === 'student' ? 'studentID' : 'academicID';
    // if poster is academic, also SELECT prefix field
    const prefix = comment.role === 'academic' ? ', prefix' : '';

    const query = `SELECT first_name, last_name${prefix} FROM ${table} WHERE ${field} = ${comment.posterID}`;

    return new Promise(
        (resolve, reject) => {
            conn.query(query, function(err, result) {
                if (err) reject (err);
                
                const name = JSON.parse(JSON.stringify(result))[0];
                resolve(name);
            })
        }
    )
}


function constructPromises(comments) {
    return new Promise(
        resolve => {
            const promises = comments.map(async (comment, index) => {
                const name = await getPosterInfo(comment);
                comments[index] = { ...comment, ...name };
            })

            Promise.all(promises)
                .then(() => {
                    resolve(comments);
                })
        }
    )
}


module.exports = router;
