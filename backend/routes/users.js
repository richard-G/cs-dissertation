var express = require('express');
const conn = require('../helpers/connection');
var router = express.Router();
var passport = require('../helpers/passport');

router.get('/', passport.authenticate('getUser'), function (req, res, next) {
  if (!req.user) {
    return res.send('not logged in');
  };

  // append action to the request, used in analytics
  req.action = 'loadProfile';

  constructResponse(req.user)
    .then(profile => {
      // console.log('profile: ', profile);
      res.send(profile);
    })
});


// returns the user profile via a students/academics table query
function getUserProfile(userID, role, email) {
  let table;
  let id;
  if (role === 'student') {
    table = 'students';
    id = 'studentID';
  } else if (role === 'academic') {
    table = 'academics';
    id = 'academicID';
  }

  const query = `SELECT * FROM ${table} WHERE email = '${email}'`;
  return new Promise(
    (resolve, reject) => {
      conn.query(query, function (err, result) {
        if (err) reject(err);

        const profile = result;
        resolve(profile);
      })
    }
  )
}

// returns university of the user via a universities table query. (as a promise)
function getUserUniversity(userID, role, email) {
  let table;
  let id;
  if (role === 'student') {
    table = 'students';
    id = 'studentID';
  } else if (role === 'academic') {
    table = 'academics';
    id = 'academicID';
  }

  const query = `SELECT u.name FROM ${table} s, universities u, users WHERE s.universityID = u.universityID AND users.email = '${email}'`;
  // console.log('uni query: ', query);
  return new Promise(
    (resolve, reject) => {
      conn.query(query, function (err, result) {
        if (err) reject(err);

        // console.log('result: ', result);
        const university = JSON.parse(JSON.stringify(result));
        resolve(university);
      })
    }
  )
}

// gets user votes
function getUserVotes(userID, role) {
  const query = `SELECT SUM(score) FROM comments WHERE posterID = ${userID}`;

  return new Promise(
    (resolve, reject) => {
      conn.query(query, function(err, result) {
        if (err) reject(err);

        const votes = JSON.parse(JSON.stringify(result));
        resolve(votes);
      })
    }
  )
}


function getUserContributions(userID, role) {
  const query = `SELECT COUNT(*) FROM comments WHERE posterID = ${userID} and role = '${role}'`;

  return new Promise(
    (resolve, reject) => {
      conn.query(query, function(err, result) {
        if (err) reject (err);

        const contributions = JSON.parse(JSON.stringify(result));
        resolve(contributions);
      })
    }
  )
}



// builds the response, appending the 'university', kudos, and contributions info onto the user object returned from the user database query.
function constructResponse(user) {
  return new Promise(
    resolve => {
      let response;
      const profilePromise = getUserProfile(user.id, user.role, user.email)
        .then(profile => {
          response = profile[0];
          response['role'] = user.role;
        });

      const uniPromise = getUserUniversity(user.id, user.role, user.email)
        .then(uni => {
          console.log('uni: ', uni[0]);
          response['university'] = uni[0]['name'];
        });

      const votesPromise = getUserVotes(user.id, user.role)
        .then(votes => {
          response['kudos'] = Object.values(votes[0])[0];
        });

      const contributionsPromise = getUserContributions(user.id, user.role)
        .then(contributions => {
          response['contributions'] = Object.values(contributions[0])[0];
        });

      Promise.all([profilePromise, uniPromise, votesPromise, contributionsPromise])
        .then(() => {
          resolve(response);
        });
    }
  )
}


module.exports = router;
