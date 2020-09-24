var express = require('express');
var router = express.Router();
var conn;
var passport = require('../helpers/passport');

// returns a list of all of the users courses as objects (should generalise to academics/students, for now just students)
router.get('/', passport.authenticate('getUser'), async function(req, res, next) {
    // ensure user is logged in
    if (!req.user) {
        // console.log('not logged in');
        return res.send('not logged in');
    } 

    let table;
    let roleID;
    if (req.user.role === 'student') {
        table = "studentModules";
        roleID = 'studentID';
    } else {
        table = "academicModules";
        roleID = 'academicID';
    }

    // set req action
    req.action = 'loadCourses';

    // connect to the db
    conn = require('../helpers/connection');
    // construct db query
    const query = `SELECT moduleID FROM ${table} WHERE ${roleID} = ${req.user.id}`; 
    conn.query(query, async function(err, result) {
        if (err) throw err;

        var modules = JSON.parse(JSON.stringify(result));
        constructResponse(modules)
            .then(modules => {
                console.log('finished constructing response: \n', modules);
                res.send(modules);
            });
    });
});



function getModuleName(moduleID) {
    const query = `SELECT name, description FROM modules WHERE moduleID = ${moduleID}`;
    return new Promise(
        (resolve, reject) => {
            conn.query(query, function(err, result) {
                if (err) reject (err);

                var name = JSON.parse(JSON.stringify(result))[0];
                resolve(name);
            })
        }
    )
}

function getModuleAcademics(moduleID) {
    const query = `SELECT a.academicID, first_name, last_name, prefix FROM academicModules as am, academics as a WHERE a.academicID = am.academicID AND am.moduleID = ${moduleID}`;
    return new Promise(
        (resolve, reject) => {
            conn.query(query, function(err, result) {
                if (err) reject (err);

                var lecturers = JSON.parse(JSON.stringify(result));
                resolve(lecturers);
            }) 
        }
    )
}

// builds an array of all promises used to build the module object (db calls)
function constructResponse(modules) {
    return new Promise(
        resolve => {
            const namePromises = modules.map((module, index) => {
                return getModuleName(module.moduleID)
                    .then(name => {
                        module = { ...module, ...name };
                        modules[index] = { ...module, ...name };
                    });
            });
            const lecturerPromises = modules.map((module, index) => {
                return getModuleAcademics(module.moduleID)
                    .then(academics => {
                        modules[index]['academics'] = academics;
                    });
            });
            const promises = namePromises.concat(lecturerPromises);
            Promise.all(promises)
                .then(() => {
                    resolve(modules);
                })
        }
    );
}

module.exports = router;
