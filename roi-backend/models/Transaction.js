const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  fk_property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  fk_advisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deal: {
    type: String,
    enum: ['venta', 'renta'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  commission: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  documents: [
    {
      name: {
        type: String,
      },
      filename: {
        type: String,
      },
      upload_date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model('Transaction', transactionSchema);