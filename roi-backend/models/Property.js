const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  type_property: {
    type: String,
    enum: ['Casa', 'Apartamento','Terreno','Local Comercial','Edificio', 'Bodega', 'Otro'],
  },
  deal: {
    type: String,
    enum: ['Venta', 'Renta', 'Otro'],
  },
  title: String,
  description: String,
  price: Number,
  payment_periodicity: {
    type: String,
    enum: ['N/A','Mensual', 'Semanal','Por día','Anual'],
  },
  land_area: Number,
  constructed_meters: Number,
  location: String,
  social_classification_area: {
    type: String,
    enum: ['Zona urbana','Residencial', 'Interés social', 'Campestre','Rural'],
  },
  features: {
    number_bedrooms: Number,
    number_bathrooms: Number,
    cistern_capacity: Number,
    garage_description: String,
    additional_notes: String
  },
  status: {
    type: String,
    enum: ['Disponible','No Disponible'],
    default: 'Disponible',
  },
  agreed_commission: {
    percentage: Number,
    amount: Number,
    notes: String
  },
  fk_advisor: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  images: [String],
});

module.exports = mongoose.model('Property', PropertySchema);
