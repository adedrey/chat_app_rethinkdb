// Import Libraries
const fs = require('fs');
const path = require('path');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// Import Models
const User = require('../models/users');

// Import Key Pairs
const pathToKey = path.join(__dirname, "..", 'id_rsa_pub.pem')

// Public Key
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

// Set up OPTIONS for JWT
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
}


module.exports = (passport) => {
    passport.use('user', new JwtStrategy(options, (payload, done) => {
        User.filter({id: payload.sub}).run()
        .then(user => {
            if (user.length > 0) {
                console.log(user[0])
                return done(null, user[0]);
            } else {
                return done(null, false)
            }
        })
        .catch(err => done(err))
    }))
}
