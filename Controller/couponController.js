const asyncHandler = require('express-async-handler');
const CouponModel = require('../Model/CouponModel');

// POST - Create a new coupon
exports.postCoupon = asyncHandler(async (req, res) => {
    const { couponName, discount, minDiscount, startingDate, expiryDate, active } = req.body;

    try {
        const newCoupon = await CouponModel.create({
            couponName, discount, minDiscount, startingDate, expiryDate, active
        });

        res.status(201).json({
            message: 'Coupon posted successfully',
            coupon: newCoupon
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while posting the coupon' });
    }
});

// GET - Get all coupons
exports.getCoupons = asyncHandler(async (req, res) => {
    try {
        const coupons = await CouponModel.find();
        res.status(200).json(coupons);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while fetching coupons' });
    }
});

// GET - Get coupon by name
exports.getCouponByName = asyncHandler(async (req, res) => {
    const { name } = req.params;
  
    try {
      const coupon = await CouponModel.findOne({ couponName: name });
      if (!coupon) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
      res.status(200).json(coupon);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while fetching the coupon' });
    }
  });
  
// GET - Get coupon by ID
exports.getCouponById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const coupon = await CouponModel.findById(id);
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        res.status(200).json(coupon);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while fetching the coupon' });
    }
});

// PUT - Update coupon by ID
exports.putCouponById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { couponName, discount, minDiscount, startingDate, expiryDate, active } = req.body;

    try {
        const existingCoupon = await CouponModel.findById(id);
        if (!existingCoupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        const update = { couponName, discount, minDiscount, startingDate, expiryDate, active };

        const updatedCoupon = await CouponModel.findByIdAndUpdate(id, { $set: update }, { new: true });
        res.status(200).json(updatedCoupon);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error while updating the coupon', error: err.message });
    }
});

// DELETE - Delete coupon by ID
exports.deleteCouponById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const response = await CouponModel.findByIdAndDelete(id);
        if (!response) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        res.status(200).json({
            message: 'Coupon deleted successfully',
            coupon: response,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while deleting the coupon' });
    }
});

// const asyncHandler = require('express-async-handler');
// const Coupon = require('../Model/CouponModel');

// // Controller to render the coupon page with a list of coupons
// exports.couponPage = asyncHandler(async (req, res) => {
//     try {
//         const coupons = await Coupon.find();
//         res.render("admin/coupon", { coupons });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send("Server Error");
//     }
// });

// // Controller to render the add coupon page
// exports.addCouponPage = asyncHandler(async (req, res) => {
//     try {
//         res.render("admin/addCoupon");
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send("Server Error");
//     }
// });

// // Controller to insert a new coupon into the database
// exports.insertCoupon = asyncHandler(async (req, res) => {
//     const { Name, Discount, minDiscount, startingDate, expiryDate } = req.body;

//     try {
//         const newCoupon = await Coupon.create({
//             couponName: Name.toUpperCase(),
//             discount: Discount,
//             minDiscount: minDiscount,
//             startingDate: startingDate,
//             expiryDate: expiryDate,
//         });
//         res.status(200).json({
//             message: 'Coupon inserted successfully',
//             coupon: newCoupon
//         });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send("An error occurred while inserting coupon");
//     }
// });

// // Controller to toggle coupon blocking status
// exports.blockCoupon = asyncHandler(async (req, res) => {
//     const { id } = req.query;

//     try {
//         if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//             return res.status(400).json({ err: 'Invalid ID format.' });
//         }

//         const coupon = await Coupon.findById(id);
//         if (!coupon) {
//             return res.status(404).json({ err: 'Coupon not found.' });
//         }

//         coupon.active = !coupon.active;
//         await coupon.save();
//         res.status(200).json({
//             message: 'Coupon status updated successfully',
//             coupon
//         });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send("An error occurred while updating coupon status");
//     }
// });

// // Controller to delete a coupon by ID
// exports.deleteCouponById = asyncHandler(async (req, res) => {
//     const { id } = req.params;

//     try {
//         if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//             return res.status(400).json({ err: 'Invalid ID format.' });
//         }

//         const response = await Coupon.findByIdAndDelete(id);
//         if (!response) {
//             return res.status(404).json({ err: 'Coupon not found.' });
//         }
        
//         res.status(200).json({
//             message: 'Coupon deleted successfully',
//             response
//         });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send("An error occurred while deleting coupon");
//     }
// });
