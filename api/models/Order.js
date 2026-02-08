const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cart_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
    items: [{
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        price: Number,
        quantity: Number
    }],
    total_price: { type: Number, required: true },
    status: { type: String, default: 'completed' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
