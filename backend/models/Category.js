const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category_type: { type: String, enum: ['income', 'expense'], required: true },
  category_major: { type: String, required: true },
  category_middle: { type: String, required: true },
  category_minor: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);