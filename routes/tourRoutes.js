const express = require('express');
const tourControllers = require('../controllers/tourControllers');
const authController = require('../controllers/authController');

const router = express.Router();
// router.param('id', tourControllers.checkId);
// Aliasing

router.route('/top-5-cheap').get(tourControllers.aliasTopTours, tourControllers.getAllTours);
router.route('/tour-stats').get(tourControllers.getTourStats);
router
    .route('/')
    .get(authController.protect, tourControllers.getAllTours)
    .post(tourControllers.createNewTour);
router.route('/monthly-plan/:year').get(tourControllers.getMonthlyPlan);
router
    .route('/:id')
    .get(tourControllers.getTour)
    .patch(tourControllers.updateTour)
    .delete(tourControllers.deleteTour);

module.exports = router;
