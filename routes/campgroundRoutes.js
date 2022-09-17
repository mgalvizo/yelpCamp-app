const express = require('express');
const campgroundController = require('../controllers/campgroundController');

const router = express.Router();

router
    .route('/campgrounds')
    .get(campgroundController.getAllCampgrounds)
    .post(
        campgroundController.validateCampground,
        campgroundController.createCampground
    );

router.get('/campgrounds/new', campgroundController.getNewCampgroundForm);

router
    .route('/campgrounds/:id')
    .get(campgroundController.getCampground)
    .put(
        campgroundController.validateCampground,
        campgroundController.updateCampground
    )
    .delete(campgroundController.deleteCampground);

router.get(
    '/campgrounds/:id/edit',
    campgroundController.getUpdateCampgroundForm
);

module.exports = router;
