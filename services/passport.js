const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const crypto = require('crypto');

function verify(email, password, done) {
    User.findOne({ email: email }, (err, user) => {
        if(err) return done(err);
        if(!user) return done(null, false);

        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
        if(user.password !== hashedPassword) return done(null, false, { message: 'wrong pass' });

        return done(null, user);
    })
}

passport.use('local', new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, verify));
passport.serializeUser((user, cb) => {
    cb(null, user.id);
});
passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
        if (err) { return cb(err) }
        cb(null, user)
    })
});

module.exports = passport;
