const express = require('express');
const reviewRouter = require('../routes/reviewRoutes');
const campgroundController = require('../controllers/campgroundController');
const userController = require('../controllers/userController');

const router = express.Router();

// NESTED route
// Send the campground id to the review router
// pattern: campgrounds/63235d8da5408b1a1a4d633c/reviews
router.use('/:campground_id/reviews', reviewRouter);

router
    .route('/')
    .get(campgroundController.getAllCampgrounds)
    .post(
        userController.isLoggedIn,
        campgroundController.validateCampground,
        campgroundController.createCampground
    );

router.get(
    '/new',
    userController.isLoggedIn,
    campgroundController.getNewCampgroundForm
);

router
    .route('/:id')
    .get(campgroundController.getCampground)
    .put(
        userController.isLoggedIn,
        campgroundController.validateCampground,
        campgroundController.updateCampground
    )
    .delete(userController.isLoggedIn, campgroundController.deleteCampground);

router.get(
    '/:id/edit',
    userController.isLoggedIn,
    campgroundController.getUpdateCampgroundForm
);

module.exports = router;
