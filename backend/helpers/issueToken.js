const jwt = require('jsonwebtoken');
const fs = require('fs');
const PRIV_KEY = fs.readFileSync('./keys/private.pem', 'utf8');

function issueJWT(user) {
    const id = user.id;
    const email = user.email;
    const role = user.role;
    const payload = {
        id: id,
        email: email,
        role: role
    };

    const signedToken = jwt.sign(payload, PRIV_KEY, { algorithm: 'RS256'});

    return "Bearer " + signedToken
}


module.exports = issueJWT;