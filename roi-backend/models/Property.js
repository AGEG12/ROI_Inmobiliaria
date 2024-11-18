const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  type_property: {
    type: String,
    enum: ['Casa', 'Apartamento','Terreno','Local Comercial','Edificio', 'Bodega', 'Otro'],
    required: true
  },
  deal: {
    type: String,
    enum: ['Venta', 'Renta', 'Otro'],
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  payment_periodicity: {
    type: String,
    enum: ['Mensual', 'Semanal','Por día','Anual','Pago único'],
    required: true
  },
  land_area: { type: Number, required: true },
  constructed_meters: { type: Number, required: true },
  location: {
    state: String,
    city: String,
    zip_code: Number,
    settlement: String,
    references: String,
  },
  social_classification_area: {
    type: String,
    enum: ['Zona urbana','Residencial', 'Interés social', 'Campestre','Rural','Otro'],
    required: true
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
    required: true
  },
  agreed_commission: {
    percentage: Number,
    amount: Number,
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
