const express = require('express');
const reviewRouter = require('../routes/reviewRoutes');
const campgroundController = require('../controllers/campgroundController');
const authController = require('../controllers/authController');

const router = express.Router();

// NESTED route
// Send the campground id to the review router
// pattern: campgrounds/63235d8da5408b1a1a4d633c/reviews
router.use('/:campground_id/reviews', reviewRouter);

router
    .route('/')
    .get(campgroundController.getAllCampgrounds)
    .post(
        authController.isLoggedIn,
        campgroundController.validateCampground,
        campgroundController.createCampground
    );

router.get(
    '/new',
    authController.isLoggedIn,
    campgroundController.getNewCampgroundForm
);

router
    .route('/:id')
    .get(campgroundController.getCampground)
    .put(
        authController.isLoggedIn,
        authController.isCampgroundAuthor,
        campgroundController.validateCampground,
        campgroundController.updateCampground
    )
    .delete(
        authController.isLoggedIn,
        authController.isCampgroundAuthor,
        campgroundController.deleteCampground
    );

router.get(
    '/:id/edit',
    authController.isLoggedIn,
    authController.isCampgroundAuthor,
    campgroundController.getUpdateCampgroundForm
);

module.exports = router;
