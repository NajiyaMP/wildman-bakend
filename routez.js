const express=require('express')
const router=new express.Router()

const adminController=require('../controller/AdminController')
const mainCategoryController=require('../controller/MainCategoryController');
const categoryController=require('../controller/categoryController');
const subCategoryController=require('../controller/subCategoryController');
const productController=require('../controller/productController')
const bannerController=require('../controller/bannerController')
const  jwtMiddleware  = require('../Middleware/jwtMiddleware');
const upload = require('../config/multerconfig');


router.post('/admin-register',adminController.registerAdmin);

// admin login
router.post('/admin-login',adminController.loginAdmin);

// main-category
router.post('/main-category', jwtMiddleware, mainCategoryController.postMaincategories);
router.get('/get-maincategory', jwtMiddleware, mainCategoryController.getMaincategories);
router.post('/get-maincategoryid/:id', jwtMiddleware, mainCategoryController.getMaincategories);
router.put('/update-maincategoryid/:id', jwtMiddleware, mainCategoryController.updateMaincategoriesById);
router.delete('/delete-maincategory/:id',jwtMiddleware, mainCategoryController.deleteMaincategoriesById);
router.get('/maincategoriescount',jwtMiddleware, mainCategoryController.countMaincategories);

// category
router.post('/add-category', jwtMiddleware, categoryController.postCategories);
router.get('/get-category', jwtMiddleware, categoryController.getCategories);
router.get('/get-categoryid/:id', jwtMiddleware, categoryController.getCategoriesById);
router.put('/update-categoryid/:id', jwtMiddleware,categoryController.updateCategoriesById);
router.delete('/delete-category/:id',jwtMiddleware, categoryController.deleteCategoriesById);
router.get('/categoriescount',jwtMiddleware,categoryController.countCategories);

// sub-category
router.post('/add-subcategory',jwtMiddleware,subCategoryController.postSubCategories);
router.get('/get-subcategory', jwtMiddleware,subCategoryController.getSubCategories);
router.get('/get-subcategoryid/:id', jwtMiddleware,subCategoryController.getCategoriesById);
router.put('/update-subcategoryid/:id', jwtMiddleware,subCategoryController.updateCategoriesById);
router.delete('/delete-subcategory/:id',jwtMiddleware,subCategoryController.deleteCategoriesById);
router.get('/subcategoriescount',jwtMiddleware,subCategoryController.countSubCategories);


// products
router.post('/add-product',jwtMiddleware,upload.array('images',4),productController.addProduct);
router.get('/get-allproduct',jwtMiddleware,productController.getAllProducts);
router.get('/get-productid/:id',jwtMiddleware,productController.getProductById);
router.put('/update-productid/:id',jwtMiddleware,upload.array('images',4),productController.updateProduct);
router.delete('/delete-product/:id',jwtMiddleware,productController.deleteProduct);
router.get('/newarrival-product',jwtMiddleware,productController.getNewArrivals);

// banner 
router.post('/add-banner',jwtMiddleware,bannerController.postBanner);
router.get('/get-allbanner',jwtMiddleware,bannerController.getBanner);
router.get('/get-bannerid/:id',jwtMiddleware,bannerController.getBannerById);
router.put('/update-bannerid/:id',jwtMiddleware,upload.array('images'),bannerController.putBannerById);
router.delete('/delete-banner/:id',jwtMiddleware,bannerController.deleteBannerById);









module.exports=router; 