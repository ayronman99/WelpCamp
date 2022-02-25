const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const userController = require('../controllers/userController')


router.route('/register')
    .get((req, res) => {res.render('users/register')})
    .post(userController.postReg)

router.route('/login')
    .get((req, res) => {res.render('users/login')})
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), userController.postLogin)

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logout success');
    res.redirect('/login');

})


module.exports = router;


