const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// Set the option to true so we can have access to the campground id
const router = express.Router({ mergeParams: true });

// Nested route to add reviews
// In app we have /reviews
// In campgroundRoutes we have /:id/reviews
// Here we have to only set the route to /
router
    .route('/')
    .post(
        authController.isLoggedIn,
        reviewController.validateReview,
        reviewController.createReview
    );

// This is the review id
// Example: req.params = {id: '63235d8da5408b1a1a4d633c', review_id: '632779c677975dba756977f3'}
router
    .route('/:review_id')
    .delete(
        authController.isLoggedIn,
        authController.isReviewAuthor,
        reviewController.deleteReview
    );

module.exports = router;
