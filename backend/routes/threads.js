var express = require('express');
var router = express.Router();
var conn;
var passport = require('../helpers/passport');

// returns a list of all of the threads linked to a given moduleID
router.get('/:moduleID', passport.authenticate('getUser'), async function(req, res, next) {
    // ensure user is logged in
    if (!req.user) {
        res.status(401).json({success: false, message: 'not logged in'});
    } else {

    }

    req.action = 'loadThreads';

    const moduleID = req.params.moduleID;
    if (moduleID === 'undefined') {
        res.status(400).json({success: false, message: 'moduleID not given in query params'})
    }
    const query = `SELECT * FROM threads WHERE moduleID = ${moduleID}`;
    // connect to the db
    conn = require('../helpers/connection');

    conn.query(query, function(err, result) {
        if (err) throw err;

        console.log('result inside first query: ', result);
        constructResponse(result, req.user.id)
            .then(threads => {
                res.send(threads);
            })
        // res.send(result);
    });

});


// POST, used if an academic creates a thread
router.post('/', passport.authenticate('getUser'), async function(req, res, next) {
    // ensure that the user has correct privileges
    if (!(req.user.role === 'academic')) {
        res.status(403).json({success: false, message: 'not authorized to make this request.'})
    } else {
        // construct the payload   req.body = {title, moduleID}
        const data = req.body;
        // convert timestamp to the datatype MySQL accepts
        data['timestamp'] = new Date().toISOString().slice(0, 19).replace('T', ' ');

        conn = require('../helpers/connection');
        conn.query('INSERT into threads SET ?', data,
            function(err, result) {
                if (err) throw err;

                res.status(200).json({success: true, message: 'thread creation successful.'});
            });
    }
});


function isBookmarked(threadID, userID) {
    const query = `SELECT COUNT(*) FROM starredthreads WHERE userID = ${userID} AND threadID = ${threadID}`
    return new Promise(
        (resolve, reject) => {
            conn.query(query, function(err, result) {
                if (err) reject (err);

                // set either to 1 or 0
                const bookmarked = Object.values(JSON.parse(JSON.stringify(result))[0])[0];
                
                // returns true if bookmarked, else false
                resolve(!!bookmarked);
            })
        }
    )
}

function constructResponse(threads, userID) {
    return new Promise(
        resolve => {
            const promises = threads.map((thread, index) => {
                return isBookmarked(thread.threadID, userID)
                    .then(bookmarked => {
                        threads[index]['bookmarked'] = bookmarked;
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
