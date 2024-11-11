// Importing required modules
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import methodOverride from 'method-override';
import { fileURLToPath } from 'url';
import path from 'path';
import ejsMate from 'ejs-mate';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';
import passport from 'passport';
import LocalStrategy from 'passport-local';

// Importing route files and user model
import listingsRoute from './routes/route.listings.js';
import reviewsRoute from './routes/route.reviews.js';
import userRoute from './routes/route.user.js';
import User from './models/model.user.js';
import { error } from 'console';

// Load environment variables from .env file
dotenv.config();

// Constants for PORT and MongoDB connection string
const PORT = 8080;
const MONGO_URL = process.env.MONGO;

// Create an Express app
const app = express();

// Get the directory name of the current module for path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Session configuration
const store = MongoStore.create({
     mongoUrl: MONGO_URL,
     crypto: {
          secret: process.env.SECRET,
     },
     touchAfter: 24 * 3600,
});
store.on('error', () => {
     console.log(`Error in MONGO store: ${error.message}`);
});
const sessionOptions = {
     store,
     secret: process.env.SECRET,
     resave: false,
     saveUninitialized: true,
     cookie: {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Cookie expires in 7 days
          maxAge: 7 * 24 * 60 * 60 * 1000, // Max age of the cookie
          httpOnly: true, // Makes the cookie inaccessible to JavaScript
     },
};

// Set up EJS as the view engine with ejsMate for layout support
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Views directory path

// Middleware setup
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(methodOverride('_method')); // Allow overriding HTTP methods (like PUT, DELETE)
app.use(cookieParser()); // Parse cookies
app.use(session(sessionOptions)); // Session management
app.use(passport.initialize()); // Initialize Passport.js
app.use(passport.session()); // Use Passport session
app.use(flash()); // For flash messages

// Set flash message variables and currentUser to res.locals
app.use((req, res, next) => {
     res.locals.success = req.flash('success');
     res.locals.error = req.flash('error');
     res.locals.currentUser = req.user;
     next();
});

// Passport.js Local Strategy setup for authentication
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MongoDB connection setup
async function main() {
     try {
          await mongoose.connect(MONGO_URL);
          console.log('Connected to DB');
     } catch (err) {
          console.error(`Database connection error: ${err.message}`);
     }
}

// Connect to the MongoDB database
main();

// Root Route - Basic test route
app.get('/', (req, res) => {
     res.render('home.ejs');
});

// Use routes for listings, reviews, and user actions
app.use('/listings', listingsRoute);
app.use('/listings/:id/reviews', reviewsRoute);
app.use('/', userRoute);

// 404 Page Not Found Handler - For undefined routes
app.use((req, res) => {
     res.status(404).render('./errors/404.ejs', { message: 'Page Not Found' });
});

// Global Error Handler - For handling all errors
app.use((err, req, res, next) => {
     const { status = 500, message = 'Something went wrong, please try again later' } = err;
     console.error(`Error Status: ${status}, Message: ${message}`);
     res.status(status).render('./errors/error.ejs', { status, message });
});

// Start the Express server
app.listen(PORT, () => {
     console.log(`Server is listening on port: ${PORT}`);
});