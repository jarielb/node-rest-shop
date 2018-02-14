const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched.'
    });
});

router.get('/:order_id', (req, res, next) => {

    res.status(200).json({
        message: 'Orders details.',
        order_id: req.params.order_id
    });
});

router.post('/', (req, res, next) => {
    const order = {
        order_id: req.body.order_id,
        quantity: req.body.quantity
    }

    res.status(201).json({
        message: 'Orders was created.',
        created_order: order
    });
});

router.delete('/:order_id', (req, res, next) => {

    res.status(200).json({
        message: 'Orders deleted.',
        order_id: req.params.order_id
    });
});

router.patch('/:order_id', (req, res, next) => {
    res.status(200).json({
        message: 'Orders was PATCHED.',
        order_id: req.params.order_id
    });
});


module.exports = router;