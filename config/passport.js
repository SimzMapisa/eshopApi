const JwtStrategy = require('passport-jwt').Strategy;
ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const Customers = mongoose.model('customers');
const Secret = process.env.secretOrKey;

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = Secret;

module.exports = passport => {
    passport.use(new JwtStrategy(options, (jwt_payload, done) => {
        // console.log(jwt_payload);
        Customers.findById(jwt_payload.id)
            .then(user => {
                if (user) {
                    return done(null, user)
                }
                return done(null, false)
            })
            .catch(err => {
                console.log(err);
            })
    })
    );
}