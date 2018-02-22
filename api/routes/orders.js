const express = require('express');
const router = express.Router();

const omit = require('../../helpers');
const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders.js');

router.get('/', checkAuth, OrdersController.get_all);

router.get('/:order_id', checkAuth, OrdersController.get);

router.post('/', checkAuth, OrdersController.create);

router.patch('/:order_id', checkAuth, OrdersController.update);

router.delete('/:order_id', checkAuth, OrdersController.delete);

router.delete('/', checkAuth, OrdersController.delete_all);

module.exports = router;