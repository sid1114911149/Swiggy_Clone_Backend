const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true
    },

    bestseller: {
      type: Boolean,
      default: false
    },

    category: {
      type: [String],
      enum: ['veg', 'non-veg'],
      required: true
    },

    image: {
      type: String
    },

    description: {
      type: String,
      default: ''
    },

    firm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Firm',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
