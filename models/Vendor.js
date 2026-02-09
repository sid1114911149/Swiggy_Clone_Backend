const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    firm: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Firm'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vendor', vendorSchema);
