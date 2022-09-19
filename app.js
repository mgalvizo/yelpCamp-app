const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
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
