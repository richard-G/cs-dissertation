var express = require('express')
var router = express.Router();
var conn;
var passport = require('../helpers/passport');

// GET, returns a list of all achievements for a user
router.get('/', passport.authenticate('getUser'), async function(req, res, next) {
    // ensure user is logged in
    if (!req.user) {
        res.status(401).json({success: false, message: 'not logged in'});
    } 

    req.action = 'loadAchievements';
    // make the initial database request, returning [{achievementID, timestamp}]
    const query = `SELECT achievementID, timestamp FROM studentachievements WHERE studentID = ${req.user.id}`;
    conn = require('../helpers/connection');
    conn.query(query,
        function(err, result) {
            if (err) throw err;
            const achievements = JSON.parse(JSON.stringify(result));
            console.log('achievements: ', achievements);
            constructResponse(achievements)
                .then(achievements => {
                    console.log('finished constructing response: \n', achievements);
                    res.send(achievements);
                });

        }
    );
});


// returns an achievement object {name, description, id, timestamp, icon_src}
function getAchievement(achievementID) {
    const query = `SELECT * FROM achievements WHERE id = ${achievementID}`;
    return new Promise(
        (resolve, reject) => {
            conn.query(query, function(err, result) {
                if (err) reject (err);
                console.log('achievement result: ', result);
                const achievement = JSON.parse(JSON.stringify(result))[0];
                resolve(achievement);
            });
        }
    )
}


function constructResponse(achievements) {
    return new Promise(
        resolve => {
            const promises = achievements.map((achievement, index) => {
                return getAchievement(achievement['achievementID'])
                    .then(achievementExtras => {
                        achievements[index] = { ...achievement, ...achievementExtras };
                    })
            });

            Promise.all(promises)
                .then(() => {
                    console.log('all promises resolved. achievements: ', achievements);
                    resolve(achievements);
                })
        }
    )
}



module.exports = router;
