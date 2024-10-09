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
const  jwtMiddleware  = require('../Middleware/jwtMiddleware');
const  userjwt  = require('../Middleware/userjwt');

const { Admin } = require('mongodb');
const ClientloginController=require('../Controller/ClientloginController');
const orderController=require('../Controller/OrderController');
const ShippingadressController=require('../Controller/ShippingadressController');







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

  // --------ADMIN ROUTES-----

// Route definitions
router.post('/login', adminController.adminlogin);
router.post('/logout', adminController.adminlogout);
router.post('/register', adminController.adminregister);



// Protected route example
router.get('/protected', isAuthenticated, (req, res) => {
    res.status(200).json({ message: 'You have access to this protected route' });
});





// ----Banner----

router.post('/postbanner',jwtMiddleware, upload.array('image'), bannerController.postBanner);
router.get('/getbanner',jwtMiddleware,bannerController.getBanner);
router.get('/getbannerbyid/:id',jwtMiddleware,bannerController.getBannerById);
router.put('/putbanner/:id',jwtMiddleware, upload.array('image'), bannerController.putBannerById);
router.delete('/deletebanner/:id',jwtMiddleware,bannerController.deleteBannerById);


//---Main categoies---

router.post('/postmaincategories',jwtMiddleware, maincategoriesController.postMaincategories);
router.get('/getmaincategories',jwtMiddleware, maincategoriesController.getMaincategories);
// router.get('/getmaincategoriespl',jwtMiddleware, maincategoriesController.getMaincategories);
router.get('/getmaincategoriesbyid/:id',jwtMiddleware, maincategoriesController.getMaincategoriesById);
router.put('/putmaincategories/:id',jwtMiddleware, maincategoriesController.putMaincategoriesById);
router.delete('/deletemaincategories/:id',jwtMiddleware, maincategoriesController.deleteMaincategoriesById);
router.get('/maincategoriescount',jwtMiddleware, maincategoriesController.countMaincategories); // New route for count




// --categories--

router.post('/postcategories',jwtMiddleware,categoriesController.postCategories);
router.get('/getcategories',jwtMiddleware,categoriesController.getCategories);
router.get('/getcategoriesbyid/:id',jwtMiddleware,categoriesController.getCategoriesById);
router.put('/putcategories/:id',jwtMiddleware,categoriesController.putCategoriesById);
router.delete('/deletecategories/:id',jwtMiddleware,categoriesController.deleteCategoriesById);
router.get('/categoriescount',jwtMiddleware, categoriesController.countCategories); // New route for count




// --subcategory--
router.post('/postsubcategories',jwtMiddleware,subcategoryController.postSubcategory);
router.get('/getsubcategories',jwtMiddleware,subcategoryController.getSubcategories);
router.get('/getsubcategoriesbyid/:id',jwtMiddleware,subcategoryController.getSubcategoryById);
router.put('/putsubcategories/:id',jwtMiddleware,subcategoryController.putSubcategoryById);
router.delete('/deletesubcategories/:id',jwtMiddleware,subcategoryController.deleteSubcategoryById);





//--dishes---
router.post('/postdishes',jwtMiddleware, upload.any(), dishesController.postDishes);
// router.post('/postdishes', upload.array('image'), dishesController.postDishes);
router.get('/getdishes',jwtMiddleware,dishesController.getDishes);
router.get('/getdishesbyid/:id',jwtMiddleware,dishesController.getDishesById);
router.put('/putdishes/:id',jwtMiddleware, upload.array('image'), dishesController.putDishesById);
router.delete('/deletedishes/:id',jwtMiddleware,dishesController.deleteDishesById);
router.get('/dishescount',jwtMiddleware, dishesController.countDishes); // New route for count



//---Colors---

router.post('/postcolors',jwtMiddleware,colorsController.postColors);
router.get('/getcolors',jwtMiddleware, colorsController.getColors);
router.get('/getcolorsbyid/:id',jwtMiddleware, colorsController.getColorsById);
router.put('/putcolors/:id',jwtMiddleware, colorsController.putColorsById);
router.delete('/deletecolors/:id',jwtMiddleware, colorsController.deleteColorsById);




//--recently viewed
router.get('/recently-viewed',jwtMiddleware, recentlyViewedController.getRecentlyViewed);
router.post('/recently-viewed',jwtMiddleware, recentlyViewedController.addRecentlyViewed);


//--wishlist--//
router.post('/postwishlist',jwtMiddleware, upload.array('image'), wishlistController.postwishlist);
router.get('/getwishlist',jwtMiddleware,wishlistController.getwishlist);
// router.get('/getwishlistbyid/:id',wishlistController.getwishlistById);
router.put('/putwishlist/:id',jwtMiddleware, upload.array('image'), wishlistController.putwishlistById);
router.delete('/deletewishlist/:id',jwtMiddleware,wishlistController.deletewishlistById);
router.get('/wishlistcount',jwtMiddleware, wishlistController.countwishlist); // New route for count


// --cart--

// router.post('/addtocart',cartController.postCart);
// router.get('/getcart', cartController.getCart);
// router.put('/updateCart/:id',cartController.updateCart);
// router.delete('/deleteCart/:id',cartController.deleteCart);
// router.get('/guestcartcount',cartController.countGuestCartItems); // New route for count


//-----coupon-----
router.post('/coupon',jwtMiddleware, couponController.postCoupon);
router.get('/coupons',jwtMiddleware, couponController.getCoupons);
router.get('/coupons/:name',jwtMiddleware, couponController.getCouponByName);
router.get('/coupon/:id',jwtMiddleware, couponController.getCouponById);
router.put('/coupon/:id',jwtMiddleware, couponController.putCouponById);
router.delete('/coupon/:id',jwtMiddleware, couponController.deleteCouponById);


//---footer settings---
router.post('/postsettings',jwtMiddleware, upload.array('image'), settingsController.postSettings);
router.get('/getsettings',jwtMiddleware, settingsController.getSettings);
router.get('/getsettings/:id',jwtMiddleware, settingsController.getSettingsById);
router.put('/putsettings/:id',jwtMiddleware, upload.array('image'), settingsController.putSettingsById);
router.delete('/deletesettings/:id',jwtMiddleware, settingsController.deleteSettingsById);



// -------------CLIENT ROUTER----------////////


// CLIET LOGIN
router.post('/client-register',ClientloginController.registerClient);
router.post('/client-login',ClientloginController.loginClient);
router.post('/logoutuser',ClientloginController.logoutclient);
router.post('/sync-guest-cart',ClientloginController.syncGuestCart);


        //  -------WITHOUT USERLOGIN-----

//Get Banner
router.get('/getbannerc',bannerController.getBanner);
router.get('/getbannercbyid/:id',bannerController.getBannerById);

//GET MAINATEGORIES
router.get('/getmaincategoriesc', maincategoriesController.getMaincategories);
router.get('/getmaincategoriescbyid/:id', maincategoriesController.getMaincategoriesById);


//GET CATEGORIES
router.get('/getcategoriesc',categoriesController.getCategories);
router.get('/getcategoriescbyid/:id',categoriesController.getCategoriesById);

//GET  SUBCATEGORIES
router.get('/getsubcategoriesc',subcategoryController.getSubcategories);
router.get('/getsubcategoriescbyid/:id',subcategoryController.getSubcategoryById);


//GET PRODUTS
router.get('/getdishesc',dishesController.getDishes);
router.get('/getdishescbyid/:id',dishesController.getDishesById);

//GET COLORS
router.get('/getcolorsc', colorsController.getColors);
router.get('/getcolorscbyid/:id',colorsController.getColorsById);

//GET COUPON
router.get('/coupons', couponController.getCoupons);
router.get('/coupons/:name',couponController.getCouponByName);
router.get('/coupon/:id', couponController.getCouponById);

//FOOTER SETTINGS
router.get('/getsettingsc',settingsController.getSettings);
router.get('/getsettingsc/:id',settingsController.getSettingsById);

// ------------------WITH USER LOGIN-------------------- //

// ----Banner----

router.post('/userpostbanner',userjwt, upload.array('image'), bannerController.postBanner);
router.get('/usergetbanner',userjwt,bannerController.getBanner);
router.get('/usergetbannerbyid/:id',userjwt,bannerController.getBannerById);
router.put('/userputbanner/:id',userjwt, upload.array('image'), bannerController.putBannerById);
router.delete('/userdeletebanner/:id',userjwt,bannerController.deleteBannerById);


//---Main categoies---

router.post('/userpostmaincategories',userjwt, maincategoriesController.postMaincategories);
router.get('/usergetmaincategories',userjwt, maincategoriesController.getMaincategories);
// router.get('/getmaincategoriespl',userjwt, maincategoriesController.getMaincategories);
router.get('/usergetmaincategoriesbyid/:id',userjwt, maincategoriesController.getMaincategoriesById);
router.put('/userputmaincategories/:id',userjwt, maincategoriesController.putMaincategoriesById);
router.delete('/userdeletemaincategories/:id',userjwt, maincategoriesController.deleteMaincategoriesById);
router.get('/usermaincategoriescount',userjwt, maincategoriesController.countMaincategories); // New route for count




// --categories--

router.post('/userpostcategories',userjwt,categoriesController.postCategories);
router.get('/usergetcategories',userjwt,categoriesController.getCategories);
router.get('/usergetcategoriesbyid/:id',userjwt,categoriesController.getCategoriesById);
router.put('/userputcategories/:id',userjwt,categoriesController.putCategoriesById);
router.delete('/userdeletecategories/:id',userjwt,categoriesController.deleteCategoriesById);
router.get('/usercategoriescount',userjwt, categoriesController.countCategories); // New route for count




// --subcategory--
router.post('/userpostsubcategories',userjwt,subcategoryController.postSubcategory);
router.get('/usergetsubcategories',userjwt,subcategoryController.getSubcategories);
router.get('/usergetsubcategoriesbyid/:id',userjwt,subcategoryController.getSubcategoryById);
router.put('/userputsubcategories/:id',userjwt,subcategoryController.putSubcategoryById);
router.delete('/userdeletesubcategories/:id',userjwt,subcategoryController.deleteSubcategoryById);





//--dishes---
router.post('/userpostdishes',userjwt, upload.any(), dishesController.postDishes);
// router.post('/postdishes', upload.array('image'), dishesController.postDishes);
router.get('/usergetdishes',userjwt,dishesController.getDishes);
router.get('/usergetdishesbyid/:id',userjwt,dishesController.getDishesById);
router.put('/userputdishes/:id',userjwt, upload.array('image'), dishesController.putDishesById);
router.delete('/userdeletedishes/:id',userjwt,dishesController.deleteDishesById);
router.get('/userdishescount',userjwt, dishesController.countDishes); // New route for count



//---Colors---

router.post('/userpostcolors',userjwt,colorsController.postColors);
router.get('/usergetcolors',userjwt, colorsController.getColors);
router.get('/usergetcolorsbyid/:id',userjwt, colorsController.getColorsById);
router.put('/userputcolors/:id',userjwt, colorsController.putColorsById);
router.delete('/userdeletecolors/:id',userjwt, colorsController.deleteColorsById);




//--recently viewed
router.get('/getuserrecently/:id',userjwt,upload.array('image'), recentlyViewedController.getRecentlyViewed);
router.post('/userrecently-viewed/:id',userjwt, recentlyViewedController.addRecentlyViewed);

// router.post('/guestrecently-viewed', recentlyViewedController.addGuestRecentlyViewed);
// router.get('/userrecently-viewed',upload.array('image'), recentlyViewedController.getRecentlyViewed);




//--wishlist--//
router.post('/userpostwishlist',userjwt, upload.array('image'), wishlistController.postwishlist);
router.get('/usergetwishlist',userjwt,wishlistController.getwishlist);
// router.get('/getwishlistbyid/:id',wishlistController.getwishlistById);
router.put('/userputwishlist/:id',userjwt, upload.array('image'), wishlistController.putwishlistById);
router.delete('/userdeletewishlist/:id',userjwt,wishlistController.deletewishlistById);
router.get('/userwishlistcount',userjwt, wishlistController.countwishlist); // New route for count


// --cart--

router.post('/useraddtocart/:id',userjwt,cartController.postCart);
router.post('/sync-guest-cart',userjwt,cartController.postguestcart);

router.get('/usergetcart/:id',userjwt, cartController.getCart);
router.put('/userupdateCart/:id',userjwt,cartController.updateCart);
router.delete('/userdeleteCart/:id', userjwt, cartController.deleteCart);
router.get('/usercartcount/:id',userjwt,cartController.countCartItems); // New route for count


//---cart guest---
// router.post('/postguestcart', cartController.postGuestCart);
// router.get('/getguestcart', cartController.getGuestCart);
// router.put('/putguestcart/:itemId', cartController.updateGuestCart);
// router.delete('/deleteguestcart/:itemId', cartController.deleteGuestCart);
// router.get('/guestcartcount', cartController.countGuestCartItems);

//-----coupon-----
router.post('/usercoupon',userjwt, couponController.postCoupon);
router.get('/usercoupons',userjwt, couponController.getCoupons);
router.get('/usercoupons/:name',userjwt, couponController.getCouponByName);
router.get('/usercoupon/:id',userjwt, couponController.getCouponById);
router.put('/usercoupon/:id',userjwt, couponController.putCouponById);
router.delete('/usercoupon/:id',userjwt, couponController.deleteCouponById);


//---footer settings---

////----OREDER ROUTES------////

router.post('/postOrder',userjwt,orderController.postOrder); //for user
router.get('/getOrder',jwtMiddleware,orderController.getAllOrders); //amin
router.get('/getOrder/:id',jwtMiddleware,orderController.getOrderById);

////-----shippingaddress------////
router.post('/postshippingad', userjwt, ShippingadressController.postShippingAddress);
router.get('/shipping-addresses', userjwt, ShippingadressController.getShippingAddresses);
router.get('/updateshipping', userjwt, ShippingadressController.updateShippingAddress);
router.get('/deleteshipping', userjwt, ShippingadressController.deleteShippingAddress);

// router.get('/getshippingad',userjwt,ShippingadressController.getshippingad); //amin
// router.get('/getshippingad/:id',userjwt,ShippingadressController.getshippingadbyId);


module.exports = router
