const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  type_property: String,
  deal: String,
  title: String,
  description: String,
  price: Number,
  land_area: Number,
  constructed_meters: Number,
  location: String,
  social_classification_area: String,
  features: {
    number_bedrooms: Number,
    number_bathrooms: Number,
    cistern_capacity: Number,
    garage_description: String,
    additional_notes: String
  },
  status: String,
  agreed_commission: {
    percentage: Number,
    amount: Number,
    notes: String
  },
  fk_advisor: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  images: [String],
});

module.exports = mongoose.model('Property', PropertySchema);
