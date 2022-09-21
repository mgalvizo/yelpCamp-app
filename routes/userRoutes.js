const express = require('express');
const passport = require('passport');
const userController = require('../controllers/userController');

const router = express.Router();

router
    .route('/')
    .get(userController.getRegistrationForm)
    .post(userController.registerUser);

router
    .route('/login')
    .get(userController.getLoginForm)
    // Passport provides an authenticate() function, which is used as route middleware to authenticate requests.
    // Middleware that uses passport to authenticate the user.
    // By default, when authentication succeeds, the req.user property is set to the authenticated user,
    // a login session is established, and the next function in the stack is called.
    // passport.authenticate() middleware invokes req.login() automatically. This function is primarily used when
    // users sign up, during which req.login() can be invoked to automatically log in the newly registered user.
    // If the user is authenticated the next loginUser function will be run.
    .post(
        passport.authenticate('local', {
            failureFlash: true,
            failureRedirect: '/users/login',
            // To keep the returnTo url property in the session
            keepSessionInfo: true,
        }),
        userController.loginUser
    );

router.post('/logout', userController.logoutUser);

module.exports = router;
