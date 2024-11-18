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
    enum: ['Venta', 'Renta', 'Otro'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  payment_periodicity: {
    type: String,
    enum: ['Mensual', 'Semanal','Por día','Anual','Pago único'],
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
        required: true
      },
      filename: {
        type: String,
        required: true
      },
      upload_date: {
        type: Date,
        default: Date.now,
        required: true
      },
    },
  ],
});

module.exports = mongoose.model('Transaction', transactionSchema);