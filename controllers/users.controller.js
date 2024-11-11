import User from '../models/model.user.js';

// Render signup form
export const renderSignupForm = (req, res) => {
     res.render('./users/signup.ejs');
};

// Handle user signup
export const signupUser = async (req, res) => {
     const { name, email, password } = req.body;

     try {
          // Check if email is already registered
          const existingUser = await User.findOne({ email });
          if (existingUser) {
               req.flash('error', 'Email is already registered.');
               return res.redirect('/signup');
          }

          // Create a new user instance
          const newUser = new User({ name, email });
          await User.register(newUser, password); // Assuming you're using passport-local-mongoose

          // Log in the user after successful registration
          req.login(newUser, (err) => {
               if (err) {
                    req.flash('error', 'Error logging in after signup. Please try again.');
                    console.error(`Login error: ${err.message}`); // Log error for debugging
                    return res.redirect('/signup');
               }
               req.flash('success', 'Account created successfully!');
               res.redirect('/listings');
          });
     } catch (error) {
          // Flash an appropriate error message based on the error type
          if (error.name === 'ValidationError') {
               req.flash('error', 'Validation Error: ' + error.message);
          } else {
               req.flash('error', 'An error occurred during signup. Please try again.');
          }
          console.error(`Signup error: ${error.message}`); // Log error for debugging
          res.redirect('/signup');
     }
};

// Render login form
export const renderLoginForm = (req, res) => {
     res.render('./users/login.ejs');
};

// Handle user login
export const loginUser = (req, res) => {
     req.flash('success', 'Welcome back!');
     res.redirect('/listings');
};

// Handle user logout
export const logoutUser = (req, res) => {
     req.logout((err) => {
          if (err) {
               req.flash('error', 'Error logging out. Please try again.');
               console.error(`Logout error: ${err.message}`); // Log error for debugging
               return res.redirect('/listings');
          }
          req.flash('success', 'You have been logged out successfully.');
          res.redirect('/login');
     });
};