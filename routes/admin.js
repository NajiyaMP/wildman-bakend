var express = require('express')
var router = express.Router()
var multer = require('multer');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
  


// var upload = multer({
//   storage: storage,
// })

var upload = multer({
  storage: storage,
}) // This will accept files with any field name


// var multer = require('multer');

// // File upload configuration
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'public/images'); // Destination folder for uploaded images
//     },
//     filename: function (req, file, cb) {
//         const fileExtension = file.originalname.split('.').pop();
//         const uniqueFilename = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + fileExtension;
//         cb(null, uniqueFilename); // Unique filename for each uploaded image
//     }
// });

// var upload = multer({
//     storage: storage,
//     fileFilter: function (req, file, cb) {
//         if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//             cb(null, true); // Allow only JPEG and PNG files
//         } else {
//             cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'));
//         }
//     }
// });

var categoriesController = require('../Controller/categoriesController')
var dishesController = require('../Controller/dishesController')
var maincategoriesController = require('../Controller/maincategoriesController');
const isAuthenticated = require('../Middleware/authMiddleware');
const adminController = require('../Controller/adminController');
const settingsController = require('../Controller/settingsController');
const subcategoryController = require('../Controller/subcategoryController');
const cartController = require('../Controller/cartController');
const bannerController = require('../Controller/bannerController');
const couponController = require('../Controller/couponController');
const recentlyViewedController = require('../Controller/recentlyViewedController');
const wishlistController = require('../Controller/wishlistController');
const colorsController = require('../Controller/colorsController');





//uploads

router.post('/upload', upload.single('file'), (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'File upload failed' });
    }

    // Construct the correct public URL to access the file
    const fileUrl = `${req.protocol}://${req.get('host')}/images/${file.filename}`;

    res.json({ url: fileUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file', error });
  }
});



// Route definitions
router.post('/login', adminController.login);
router.post('/logout', adminController.logout);
// Protected route example
router.get('/protected', isAuthenticated, (req, res) => {
    res.status(200).json({ message: 'You have access to this protected route' });
});

// ----Banner----

router.post('/postbanner', upload.array('image'), bannerController.postBanner);
router.get('/getbanner',bannerController.getBanner);
router.get('/getbannerbyid/:id',bannerController.getBannerById);
router.put('/putbanner/:id', upload.array('image'), bannerController.putBannerById);
router.delete('/deletebanner/:id',bannerController.deleteBannerById);

//---Main categoies---

router.post('/postmaincategories', maincategoriesController.postMaincategories);
router.get('/getmaincategories', maincategoriesController.getMaincategories);
router.get('/getmaincategoriesbyid/:id', maincategoriesController.getMaincategoriesById);
router.put('/putmaincategories/:id', maincategoriesController.putMaincategoriesById);
router.delete('/deletemaincategories/:id', maincategoriesController.deleteMaincategoriesById);
router.get('/maincategoriescount', maincategoriesController.countMaincategories); // New route for count


// --categories--

router.post('/postcategories',categoriesController.postCategories);
router.get('/getcategories',categoriesController.getCategories);
router.get('/getcategoriesbyid/:id',categoriesController.getCategoriesById);
router.put('/putcategories/:id',categoriesController.putCategoriesById);
router.delete('/deletecategories/:id',categoriesController.deleteCategoriesById);
router.get('/categoriescount', categoriesController.countCategories); // New route for count


// --subcategory--
router.post('/postsubcategories',subcategoryController.postSubcategory);
router.get('/getsubcategories',subcategoryController.getSubcategories);
router.get('/getsubcategoriesbyid/:id',subcategoryController.getSubcategoryById);
router.put('/putsubcategories/:id',subcategoryController.putSubcategoryById);
router.delete('/deletesubcategories/:id',subcategoryController.deleteSubcategoryById);



//--dishes---
router.post('/postdishes', upload.any(), dishesController.postDishes);

// router.post('/postdishes', upload.array('image'), dishesController.postDishes);
router.get('/getdishes',dishesController.getDishes);
router.get('/getdishesbyid/:id',dishesController.getDishesById);
router.put('/putdishes/:id', upload.array('image'), dishesController.putDishesById);
router.delete('/deletedishes/:id',dishesController.deleteDishesById);
router.get('/dishescount', dishesController.countDishes); // New route for count

//---Colors---

router.post('/postcolors',colorsController.postColors);
router.get('/getcolors', colorsController.getColors);
router.get('/getcolorsbyid/:id', colorsController.getColorsById);
router.put('/putcolors/:id', colorsController.putColorsById);
router.delete('/deletecolors/:id', colorsController.deleteColorsById);


//--recently viewed
router.get('/recently-viewed/:userId', recentlyViewedController.getRecentlyViewed);
router.post('/recently-viewed', recentlyViewedController.addRecentlyViewed);


//--wishlist--//
router.post('/postwishlist', upload.array('image'), wishlistController.postwishlist);
router.get('/getwishlist',wishlistController.getwishlist);
// router.get('/getwishlistbyid/:id',wishlistController.getwishlistById);
router.put('/putwishlist/:id', upload.array('image'), wishlistController.putwishlistById);
router.delete('/deletewishlist/:id',wishlistController.deletewishlistById);
router.get('/wishlistcount', wishlistController.countwishlist); // New route for count


// --cart--

router.post('/addtocart',cartController.postCart);
router.get('/getcart', cartController.getCart);
router.put('/updateCart/:id',  cartController.updateCart);
router.delete('/deleteCart/:id', cartController.deleteCart);
router.get('/cartcount', cartController.countCartItems); // New route for count


//-----coupon-----
router.post('/coupon', couponController.postCoupon);
router.get('/coupons', couponController.getCoupons);
router.get('/coupons/:name', couponController.getCouponByName);
router.get('/coupon/:id', couponController.getCouponById);
router.put('/coupon/:id', couponController.putCouponById);
router.delete('/coupon/:id', couponController.deleteCouponById);



//---footer settings---
router.post('/postsettings', upload.array('image'), settingsController.postSettings);
router.get('/getsettings', settingsController.getSettings);
router.get('/getsettings/:id', settingsController.getSettingsById);
router.put('/putsettings/:id', upload.array('image'), settingsController.putSettingsById);
router.delete('/deletesettings/:id', settingsController.deleteSettingsById);

module.exports = router
