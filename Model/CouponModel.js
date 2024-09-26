const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    couponName: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    minDiscount: {
        type: Number,
        required: true
    },
    startingDate: {
        type: Date,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    users: [
        {
            userId: mongoose.Types.ObjectId
        }
    ]
});

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
