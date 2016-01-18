const Express = require('express');
const Router = Express.Router();
const Passport = require('passport');
const PassportConfig = require('../../../auth/local_passporthandler');
const PasswordCrypto = require('../../../auth/password_crypt');

const Schema = require('../../../model/export');

const User = Schema.user;
const Repository = Schema.repository;

const CommonUser = require('../../../model/common/user');


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
    Router.post('/signup', function (req, res, next) {

        if (req.user) {
            return res.redirect('/');
        }

        CommonUser.signUp(req, res, next, true);
    });


    /**
     * Try to log in
     */
    Router.post('/login', function (req, res, next) {

        if (req.user) {
            return res.redirect('/');
        }
        CommonUser.login(req, res, next, true);
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
        User.findOne({
            where: {
                username: req.params.user
            }
        }).then(function (user) {
            user.destroy().then(function (res) {
                res.redirect('/');
            });
        }).error(function (err) {
            console.log(err);
            res.redirect('/');
        });
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
