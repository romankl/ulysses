'use strict';

const User = require('../model/bootstrap').sequelize.models.users;
const Passport = require('passport');
const LocalPassport = require('passport-local').Strategy;
const PasswordCrypt = require('./password_crypt');

Passport.serializeUser(function (user, done) {

    done(null, user.id);
});

Passport.deserializeUser(function (id, done) {

    User.findOne({
        where: {
            id: id
        }
    }).then(function (user) {

        done(null, user);
    }).error(function (err) {

        done(err, null);
    });
});


Passport.use(new LocalPassport({usernameField: 'email'}, function (email, password, done) {

    email = email.toLowerCase();

    User.findOne({
        where: {
            email: email
        }
    }).then(function (user) {

        if (!user) {
            return done(null, false, {message: 'Email ' + email + ' not found'});
        }

        PasswordCrypt.comparePassword(password, user.password, function (err, match) {

            if (match) {
                done(null, user);
            } else {
                done(null, false, {message: err});
            }
        });
    }).error(function (err) {

        console.log('err: ' + err);
        if (!user) {
            return done(null, false, {message: err});
        }
    });
}));
