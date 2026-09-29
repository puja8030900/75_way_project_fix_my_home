const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true, // Prevent duplicate reviews for the same booking
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate average rating after save
reviewSchema.post('save', async function() {
  const Service = mongoose.model('Service');
  const result = await this.constructor.aggregate([
    { $match: { serviceId: this.serviceId } },
    { $group: { _id: '$serviceId', averageRating: { $avg: '$rating' } } }
  ]);
  
  if (result.length > 0) {
    await Service.findByIdAndUpdate(this.serviceId, {
      averageRating: Math.round(result[0].averageRating * 10) / 10
    });
  }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
