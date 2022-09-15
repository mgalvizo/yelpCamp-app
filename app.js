const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');

const Campground = require('./models/campgroundModel');
const {
    findByIdAndUpdate,
    findByIdAndDelete,
} = require('./models/campgroundModel');

dotenv.config({ path: './.env' });

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

const connectDB = async () => {
    try {
        await mongoose.connect(DB);
        console.log('DB connection successful');
    } catch (error) {
        console.log(error);
    }
};

connectDB();

const app = express();

// Specify that we want to use ejs-mate as the engine instead of the default one
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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

const port = process.env.PORT || 8080;

// Setting the routes

// Get all campgrounds
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {
        campgrounds,
    });
});

// Create campground render and POST routes
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.post('/campgrounds', async (req, res) => {
    // Pass the campground object from the req.body
    const campground = await Campground.create(req.body.campground);

    res.redirect(`/campgrounds/${campground._id}`);
});

// Get one campground by id
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById({ _id: id });

    res.render('campgrounds/details', {
        campground,
    });
});

// Update campground render and PUT routes
app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById({ _id: id });
    res.render('campgrounds/edit', {
        campground,
    });
});

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(
        id,
        {
            ...req.body.campground,
        },
        { new: true }
    );

    res.redirect(`/campgrounds/${campground._id}`);
});

// Delete campgroud route
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);

    res.redirect('/campgrounds');
});

app.all('*', (req, res, next) => {
    res.status(404).send(`Can't find ${req.originalUrl} on this server`);
});

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
