const express = require('express');
const reviewRouter = require('../routes/reviewRoutes');
const campgroundController = require('../controllers/campgroundController');

const router = express.Router();

// NESTED route
// Send the campground id to the review router
// pattern: campgrounds/63235d8da5408b1a1a4d633c/reviews
router.use('/:campground_id/reviews', reviewRouter);

router
    .route('/')
    .get(campgroundController.getAllCampgrounds)
    .post(
        campgroundController.validateCampground,
        campgroundController.createCampground
    );

router.get('/new', campgroundController.getNewCampgroundForm);

router
    .route('/:id')
    .get(campgroundController.getCampground)
    .put(
        campgroundController.validateCampground,
        campgroundController.updateCampground
    )
    .delete(campgroundController.deleteCampground);

router.get('/:id/edit', campgroundController.getUpdateCampgroundForm);

module.exports = router;
