const mongoose = require('mongoose');

const firmSchema = new mongoose.Schema(
  {
    firmName: {
      type: String,
      required: true,
      trim: true
    },

    area: {
      type: String,
      required: true
    },

    category: {
      type: [String],
      enum: ['veg', 'non-veg'],
      required: true
    },

    region: {
      type: [String],
      enum: ['south-indian', 'north-indian', 'chinese', 'bakery']
    },

    offer: {
      type: String
    },

    image: {
      type: String
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true
    },

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Firm', firmSchema);
