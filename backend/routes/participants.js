var express = require('express');
const conn = require('../helpers/connection');
const passport = require('../helpers/passport');
var router = express.Router();


/* returns a list of all students for a given moduleID. */
router.get('/:moduleID', passport.authenticate('getUser'), function(req, res, next) {
//   const data = req.body;
  const moduleID = req.params.moduleID;

  // set action for analytics
  req.action = 'loadParticipants';

  getModuleParticipants(moduleID)
    .then(participants => {
        console.log('participants: ', participants);
        res.send(participants);
    })


    
});


function getModuleParticipants(moduleID) {
    const query = "SELECT s.studentID, s.first_name, s.last_name FROM students s, studentModules sm WHERE sm.studentID = s.studentID AND sm.moduleID = ?";

    return new Promise(
        (resolve, reject) => {
            conn.query(query, moduleID, function(err, result) {
                if (err) reject (err);

                console.log('result: ', result);

                const participants = JSON.parse(JSON.stringify(result));
                resolve(participants);
            });
        }
    )
}



module.exports = router;
