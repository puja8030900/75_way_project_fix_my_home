const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Plumbing',
        'Electrical Repairs',
        'AC Repair and Servicing',
        'Home Cleaning',
        'Appliance Repair',
        'Refrigerator Repair',
        'Mobile Repair',
        'Carpentry',
        'Painting',
        'Pest Control'
      ],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    estimatedDuration: {
      type: String,
      required: true, // e.g. "2 hours"
    },
    image: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
