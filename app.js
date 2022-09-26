const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
// Require regular passport
const passport = require('passport');
// Require the local strategy
const LocalStrategy = require('passport-local');

// Require the user model
const User = require('./models/userModel');

const AppError = require('./utilities/appError');
const globalErrorHandler = require('./controllers/errorController');

const campgroundRouter = require('./routes/campgroundRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Enable trust proxy so the session works in heroku
app.enable('trust proxy');

// Specify that we want to use ejs-mate as the engine instead of the default one
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Use helmet
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            'script-src': [
                "'self'",
                'https://*.tiles.mapbox.com',
                'https://api.mapbox.com',
                'https://events.mapbox.com',
                'https://cdn.jsdelivr.net',
            ],
            'worker-src': ["'self'", 'blob:'],
            'img-src': [
                "'self'",
                'data:',
                'blob:',
                `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
                'https://images.unsplash.com/',
            ],
            'connect-src': [
                'https://*.tiles.mapbox.com',
                'https://api.mapbox.com',
                'https://events.mapbox.com',
                'ws://127.0.0.1:*/',
            ],
        },
    })
);

// Use express-mongo-sanitize
app.use(mongoSanitize());

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

// Configure express session
// By default, connect-mongo uses MongoDB's TTL collection feature (2.2+) to
// have mongod automatically remove expired sessions. (14 days)
app.use(
    session({
        // Change the default name of the cookie to avoid attacks
        name: '_blackhole',
        secret: process.env.SESSION_SECRET,
        // Store session information in Mongo
        store: MongoStore.create({
            mongoUrl: DB,
            // Avoid unnecessary resaves when the data in the session has not changed
            // Resave after 24 hrs in seconds
            touchAfter: 24 * 60 * 60,
            crypto: {
                secret: process.env.SESSION_SECRET,
            },
        }),
        resave: false,
        // When saveUninitialized is set to false the session cookie will not be set on the browser unless the session is
        // modified (and therefore it might not appear right away). Setting saveUninitialized to true would enable the session
        // to be created for every visitor even when the session is empty and unmodified (and that's why it would appear right away)
        saveUninitialized: true,
        cookie: {
            // The cookie cannot be accessed or modified in any way by the browser
            httpOnly: true,
            // The cookie will work only on https, set to true in for production only
            secure: process.env.NODE_ENV === 'production' ? true : false,
            // Expires in 10 days from now
            expires:
                Date.now() +
                process.env.SESSION_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000,
            // Max age of 10 days
            maxAge: process.env.SESSION_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000,
        },
    })
);

// Use flash for all requests.
// This sets a flash method on the request object.
app.use(flash());

// To use Passport in an Express or Connect-based application, configure it with the required passport.initialize() middleware.
// If your application uses persistent login sessions (recommended, but not required), passport.session() middleware must also be used.
// Make sure the middleware is after the express-session configuration.
app.use(passport.initialize());
app.use(passport.session());
// authenticate is a passport-local-mongoose method that authenticates a user object. If no callback is provided a Promise is returned.
// authenticate() Generates a function that is used in Passport's LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// passport-local-mongoose serializeUser() Generates a function that is used by Passport to serialize users into the session
// (how do we store a user in the session)
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// passport-local-mongoose deserializeUser() Generates a function that is used by Passport to deserialize users into the session
// (how do we get a user out of the session)

// Parse the req.body in a form
app.use(
    express.urlencoded({
        extended: true,
        limit: '10kb',
    })
);

// Use method override with a query value
app.use(methodOverride('_method'));

// Use morgan as a logger middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Flash global middleware for messages in all routes
// res.locals: Use this property to set variables accessible in templates rendered with res.render. The
// variables set on res.locals are available within a single request-response cycle, and will not be shared between requests.
app.use((req, res, next) => {
    // Set a success property on locals to retrieve flash messages with a key of "success" and automatically pass it to templates
    // in the success variable <%= success %>
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    // Set a current user property on locals equal to the req.user property created after logging in.
    res.locals.currentUser = req.user;
    // Checking the properties of the session object
    // console.log(req.session);

    next();
});

// Mounting the routers
app.use('/campgrounds', campgroundRouter);
app.use('/reviews', reviewRouter);
app.use('/users', userRouter);

// Home page
app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    const message = `Can't find ${req.originalUrl} on this server`;
    throw new AppError(message, 404);
});

// Using Global Error Handling Middleware
app.use(globalErrorHandler);

// Export app
module.exports = app;
