import passport from 'passport';
import { IUser } from "../types";
import { Strategy as LocalStrategy } from "passport-local";
import { NativeError, Document } from 'mongoose'

const User = require('../models/User');
const crypto = require('crypto');

passport.use('local', new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {
    User.findOne({ email: email }, (err: NativeError, user: IUser & Document) => {
        if(err) return done(err);
        if(!user) return done(null, false);

        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
        if(user.password !== hashedPassword) return done(null, false, { message: 'wrong pass' });

        return done(null, user);
    })
}));
passport.serializeUser((user, cb) => {
    cb(null, user);
});
passport.deserializeUser((id, cb) => {
    User.findById(id, (err: NativeError, user: IUser & Document ) => {
        if (err) { return cb(err) }
        cb(null, user)
    })
});

export default passport;
