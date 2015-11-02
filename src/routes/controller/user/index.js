const gravatar = require('gravatar');
const Passport = require('passport');
const PassportConfig = require('../../../auth/LocalPassportHandler');
const PasswordCrypto = require('../../../auth/PasswordCrypt');
const User = require('../../../model/commonModel').user;
const Repository = require('../../../model/commonModel').repository;
const Express = require('express');
const Router = Express.Router();

module.exports = function () {

    /**
     * Get the basic user profile
     */
    Router.get('/u/:user', function (req, res) {

        User.findUserByUsername(req.params.user, function (err, result) {

            if (result) {
                const user = result;
                Repository.findRepositoryByOwnerId(user.id, function (err, result) {

                    var repo = [{}];
                    if (result) {
                        repo = result.dataValues;
                    }
                    res.render('profile', {user: user, repository: repo});
                });
            } else {
                res.status(404);
            }
        });
    });


    /**
     * Get the signup page
     */
    Router.get('/signup', function (req, res, next) {

        if (req.user) {
            return res.redirect('/');
        }

        return res.render('signup', {title: 'Sign In'});
    });


    /**
     * Get the login page
     */
    Router.get('/login', function (req, res) {

        if (req.user) {
            return res.redirect('/');
        }

        res.render('login', {title: 'Login'});
    });


    /**
     * Logout
     */
    Router.get('/logout', function (req, res) {

        req.logout();
        res.redirect('/');
    });


    /**
     * Try to sign up using the posted credentials
     */
    Router.post('/signup', function (req, res) {

        if (req.user) {
            return res.redirect('/');
        }

        req.assert('email', 'Email must be a valid mail').isEmail();
        req.assert('password', 'Password too short - must be at least 6 characters long').len(6);
        req.assert('confirm', 'Passwords aren\'t equal').equals(req.body.password);

        const errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('/signup');
        }

        // the user table has a primary key on the mail, it should be unique across the table.
        User.findAll(
            {
                where: {
                    email: req.body.email
                }
            }).then(function (users) {
            // we search using `findAll`, that should create an Array of users who have the same email.
            if (users.length == 0) {
                PasswordCrypto.cryptPassword(req.body.password, function (err, hashed) {

                    const user = User.create({
                        email: req.body.email,
                        username: req.body.username,
                        name: req.body.name,
                        password: hashed,
                        avatarUrl: gravatar.url(req.body.email, {s: '100', r: 'x', d: 'retro'}, true)
                    }).then(function (result) {

                        req.login(result.dataValues, function (err) {
                            if (err) {
                                console.log(err);
                                return;
                            }

                            res.redirect('/');
                        });
                    }).error(function (err) {

                        console.log('err while creating a new user: ' + err);
                    });
                });
            } else {
                // seems like the user already exists, redirect it
                return res.redirect('/signup');
            }
        }).error(function (err) {

            console.log(err);
        });
    });


    /**
     * Try to log in
     */
    Router.post('/login', function (req, res, next) {

        if (req.user) {
            return res.redirect('/');
        }

        req.assert('email', 'Email must be a valid mail').isEmail();
        req.assert('password', 'Password too short - must be at least 6 characters long').len(6);

        const errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('/login');
        }

        Passport.authenticate('local', function (err, user, info) {

            if (err) {
                console.log(err);
                return res.redirect('/');
            }

            req.login(user.dataValues, function (err) {

                if (err) {
                    console.log(err);
                    return res.redirect('/');
                }

                res.redirect('/');
            });
        })(req, res, next);
    });


    /**
     * Get the user settings
     * - TODO: Needs passport isLoggedIn guard
     */
    Router.get('/settings', function (req, res, next) {
        res.redirect('/');
    });


    /**
     * Update the settings of the user
     * - TODO: Needs passport isLoggedIn guard
     */
    Router.post('/settings', function (req, res, next) {
        res.redirect('/');
    });


    /**
     * Gets the update page for the SSH Keys
     */
    Router.get('/keys/u/:user', function (req, res, next) {
        res.redirect('/');
    });


    /**
     * Updates the SSH Keys
     */
    Router.post('/keys/u/:user', function (req, res, next) {
        res.redirect('/');
    });


    /**
     * Gets the update page for the user profile
     */
    Router.get('/profile/u/:user', function (req, res, next) {
        res.redirect('/');
    });


    /**
     * Updates the user profile
     */
    Router.post('/profile/u/:user', function (req, res, next) {
        res.redirect('/');
    });

    /**
     * Deletes the user account
     */
    Router.get('/delete/u/:user', function (req, res, next) {
        res.redirect('/');
    });


    /**
     * Gets the activity stream
     */
    Router.get('/activity/:user/', function (req, res, next) {
        res.redirect('/');
    });


    /**
     * Follows a user
     */
    Router.get('/follow/u/:user', function (req, res, next) {
        res.redirect('/');
    });


    return Router;
};
