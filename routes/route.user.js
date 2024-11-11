import express from 'express';
import passport from 'passport';
import {
     renderSignupForm,
     signupUser,
     renderLoginForm,
     loginUser,
     logoutUser
} from '../controllers/users.controller.js';

const router = express.Router();

// Route to render signup form
router.get('/signup', renderSignupForm);

// Route to handle signup
router.post('/signup', signupUser);

// Route to render login form
router.get('/login', renderLoginForm);

// Route to handle login
router.post('/login', passport.authenticate('local', {
     successRedirect: '/listings',
     failureRedirect: '/login',
     failureFlash: true
}), loginUser);

// Route to handle logout
router.get('/logout', logoutUser);

export default router;