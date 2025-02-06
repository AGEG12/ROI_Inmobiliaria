const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type_property: {
    type: String,
    enum: ['Casa', 'Apartamento', 'Terreno', 'Local comercial', 'Edificio', 'Bodega', 'Otro'],
    required: true
  },
  land_measurements: { type: String, required: true },
  social_classification_area: {
    type: String,
    enum: ['Zona urbana', 'Residencial', 'Interés social', 'Campestre', 'Rural', 'Otro'],
    required: true
  },
  status: {
    type: String,
    enum: ['Disponible', 'No Disponible'],
    default: 'Disponible',
    required: true
  },
  offer: {
    deal: {
      type: String,
      enum: ['Venta', 'Renta', 'Venta o Renta'],
      required: true
    },
    payment_periodicity: {
      type: String,
      enum: ['Mensual', 'Semanal', 'Por día', 'Anual', 'Pago único']
    },
    sales_price: Number,
    rental_price: Number,
  },
  location: {
    state: { type: String, required: true },
    city: { type: String, required: true },
    zip_code: { type: Number, required: true },
    settlement: { type: String, required: true },
    references: String,
  },
  features: {
    constructed_meters: Number,
    number_bedrooms: Number,
    number_bathrooms: Number,
    cistern_capacity: Number,
    garage_description: String,
    additional_notes: String
  },
  agreed_commission: {
    percentage_sale: Number,
    amount_sale: Number,
    percentage_rent: Number,
    amount_rent: Number,
    notes: String
  },
  fk_advisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  images: [String],
});

module.exports = mongoose.model('Property', PropertySchema);
