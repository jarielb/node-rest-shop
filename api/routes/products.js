const express = require('express');
const router = express.Router();
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');

const ProductsController = require('../controllers/products')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter : fileFilter
});

router.get('/', ProductsController.get_all);

router.get('/:product_id', ProductsController.get);

router.post('/', upload.single('image'), checkAuth, ProductsController.create);

router.patch('/:product_id', checkAuth, ProductsController.update);

router.delete('/', checkAuth, ProductsController.delete_all);

router.delete('/:product_id', checkAuth, ProductsController.delete);

module.exports = router;