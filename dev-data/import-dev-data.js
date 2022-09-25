const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Campground = require('../models/campgroundModel');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

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

// Random number from 0 to Num
const randomNumber = num => {
    return Math.floor(Math.random() * num);
};

// Random element from array
const randomElement = arr => {
    return arr[Math.floor(Math.random() * arr.length)];
};

const seedDB = async () => {
    try {
        await Campground.deleteMany({});

        // create 10 inserts to the Database
        for (let i = 0; i < 20; i++) {
            const random1000 = randomNumber(1000);
            const price = randomNumber(30) + 10;

            await Campground.create({
                title: `${randomElement(descriptors)} ${randomElement(places)}`,
                images: [
                    {
                        url: 'https://res.cloudinary.com/dnqk2iuyx/image/upload/v1663971760/yelpCamp-app/htyg2xd8zr0dp3msuj50.jpg',
                        filename: 'yelpCamp-app/htyg2xd8zr0dp3msuj50',
                    },
                    {
                        url: 'https://res.cloudinary.com/dnqk2iuyx/image/upload/v1663971760/yelpCamp-app/y7ah6jsiyxeyxgmvuzfg.jpg',
                        filename: 'yelpCamp-app/y7ah6jsiyxeyxgmvuzfg',
                    },
                ],
                price,
                description:
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium aspernatur illum quasi optio, nobis aliquam eaque, debitis quam ab nesciunt amet, inventore eveniet libero officiis voluptate minus officia? Corrupti, blanditiis.',
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                // all campgrounds will have the same author at the beginning, update this
                // if the author is deleted somehow
                author: '632b56412b1beeb9f4441b22',
                geometry: {
                    type: 'Point',
                    coordinates: [
                        cities[random1000].longitude,
                        cities[random1000].latitude,
                    ],
                },
            });
        }
        console.log('Data successfully loaded');
    } catch (error) {
        console.log(error);
    }
};

// Properly close Mongoose's connection once it's done
seedDB().then(() => {
    mongoose.disconnect();
});
