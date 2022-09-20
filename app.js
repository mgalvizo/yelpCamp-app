const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const AppError = require('./utilities/appError');
const globalErrorHandler = require('./controllers/errorController');
const campgroundRouter = require('./routes/campgroundRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// Specify that we want to use ejs-mate as the engine instead of the default one
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Configure express session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        // When saveUninitialized is set to false the session cookie will not be set on the browser unless the session is
        // modified (and therefore it might not appear right away). Setting saveUninitialized to true would enable the session
        // to be created for every visitor even when the session is empty and unmodified (and that's why it would appear right away)
        saveUninitialized: true,
        cookie: {
            // The cookie cannot be accessed or modified in any way by the browser
            httpOnly: true,
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

// Flash middleware for messages in all routes
// res.locals: Use this property to set variables accessible in templates rendered with res.render. The
// variables set on res.locals are available within a single request-response cycle, and will not be shared between requests.
app.use((req, res, next) => {
    // Set a success property on locals to retrieve flash messages with a key of "success" and automatically pass it to templates
    // in the success variable <%= success %>
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');

    next();
});

// Mounting the routers
app.use('/campgrounds', campgroundRouter);
app.use('/reviews', reviewRouter);

app.all('*', (req, res, next) => {
    const message = `Can't find ${req.originalUrl} on this server`;
    throw new AppError(message, 404);
});

// Using Global Error Handling Middleware
app.use(globalErrorHandler);

// Export app
module.exports = app;
