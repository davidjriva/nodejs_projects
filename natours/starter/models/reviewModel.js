const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must have an associated author'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must have an associated tour'],
    },
    review: {
      type: String,
      required: [true, 'A review must have a body'],
      maxLength: [1000, 'A review can have a maximum size of 1000 characters.'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'A review must have an associated rating of the tour'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      required: [true, 'A review must have a timestamp'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Populate the user and tour field on find queries
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;