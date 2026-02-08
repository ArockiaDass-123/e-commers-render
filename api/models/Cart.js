const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1 }
    }],
    status: { type: String, default: 'active' } // active, converted
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
