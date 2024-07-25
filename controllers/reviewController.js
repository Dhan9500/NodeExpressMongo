const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const allReview = await Review.find();
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestedTime,
    data: {
      reviews: allReview,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);
  res.status(200).json({
    status: 'success',
    createdAt: req.requestedTime,
    data: {
      review: newReview,
    },
  });
});
