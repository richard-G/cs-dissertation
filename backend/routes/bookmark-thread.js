var express = require('express');
var router = express.Router();
var conn;
var passport = require('../helpers/passport');

// GET, returns a list of all bookmarked threads for a user
router.get('/', passport.authenticate('getUser'), async function(req, res, next) {
    // ensure user is logged in
    if (!req.user) {
        res.status(401).json({success: false, message: 'not logged in'});
    } 
    req.action = 'loadBookmarks';
    // make the initial database request, returning list of threadIDs
    const query = `SELECT threadID FROM starredthreads WHERE userID = ${req.user.id}`;
    conn = require('../helpers/connection');
    conn.query(query,
        function(err, result) {
            if (err) throw err;
            const threadIDs = JSON.parse(JSON.stringify(result));
            constructResponse(threadIDs)
                .then(threads => {
                    res.send(threads);
                });

        }
    );
});

// POST, used if a user adds or removes a bookmark
router.post('/', passport.authenticate('getUser'), async function(req, res, next) {
    // ensure user is logged in
    if (!req.user) {
        res.status(401).json({success: false, message: 'not logged in'});
    } 

    // construct the payload. req.body = {threadID}
    const data = req.body;
    data['userID'] = req.user.id;

    conn = require('../helpers/connection');

    // check for whether to add or remove the bookmark
    const query = `SELECT COUNT(*) FROM starredthreads WHERE userID = ${req.user.id} AND threadID = ${data['threadID']}`;
    console.log('first starredthreads query: ', query);
    conn.query(query, function(err, result) {
        if (err) throw err;
        // set to the value of the COUNT(*) query
        const bookmarkExists = Object.values(JSON.parse(JSON.stringify(result))[0])[0];
        if (!bookmarkExists) {
            // logic to INSERT bookmark
            req.action = 'addBookmark';
            conn.query(`INSERT INTO starredthreads SET ?`, data,
            function(err, result) {
                if (err) throw err;
                res.status(200).json({success: true, message: 'Thread added to bookmarks.'});
            });
        } else {
            // logic to REMOVE bookmark
            req.action = 'removeBookmark';
            const query = `DELETE FROM starredthreads WHERE userID = ${req.user.id} AND threadID = ${data['threadID']}`;
            conn.query(query, function(err) {
                if (err) throw err;
                res.status(200).json({success: true, message: 'Thread removed from bookmarks.'})
            });
        }
    })
});

// returns a thread object, given the threadID
function getThread(threadID) {
    const query = `SELECT * FROM threads WHERE threadID = ${threadID}`;
    return new Promise(
        (resolve, reject) => {
            conn.query(query, function(err, result) {
                if (err) reject (err);
                console.log('result: ', result);
                const thread = JSON.parse(JSON.stringify(result))[0];
                resolve(thread);
            })
        }
    )
}

// constructs the response by Promising all of the individual db calls
function constructResponse(threadIDs) {
    return new Promise(
        resolve => {
            // init empty threads array, this is populate for each getThread call
            let threads = [];
            const promises = threadIDs.map(threadID => {
                return getThread(threadID['threadID'])
                    .then(thread => {
                        thread['bookmarked'] = true;
                        threads.push(thread);
                    });
            });

            Promise.all(promises)
                .then(() => {
                    resolve(threads);
                });
        }
    )
}


module.exports = router;
