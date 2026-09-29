const Review = require('../models/Review');
const Booking = require('../models/Booking');

exports.createReview = async (req, res, next) => {
  try {
    const { serviceId, bookingId, rating, comment } = req.body;

    // Verify booking belongs to user and is completed
    const booking = await Booking.findOne({
      _id: bookingId,
      customerId: req.user._id,
      status: 'Completed'
    });

    if (!booking) {
      return res.status(400).json({ message: 'Valid completed booking not found for this user' });
    }

    const review = await Review.create({
      customerId: req.user._id,
      serviceId,
      bookingId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this booking' });
    }
    next(error);
  }
};

exports.getServiceReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ serviceId: req.params.serviceId })
      .populate('customerId', 'name')
      .sort('-createdAt');
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};
