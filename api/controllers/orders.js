const mongoose = require('mongoose');

const omit = require('../../helpers');

const Order = require('../models/orders');
const Product = require('../models/products');

exports.get_all = (req, res, next) => {
    Order
        .find()
        .select('-__v')
        .populate('product', '-__v')
        .exec()
        .then(docs => {
            const response = {
                total: docs.length,
                docs: docs.map(doc => {
                    return {
                        ...doc._doc,
                        request: {
                            type: 'GET',
                            url: "http://" + process.env.APP_URL + "/orders/" + doc._id
                        }
                    }
                }),
                success: true,
                message: 'Orders were fetched.'
            }
            res
                .status(200)
                .json(response);
        })
        .catch(err => {
            res
                .status(500)
                .json({
                    success: false,
                    error: err
                })
        })
};

exports.get = (req, res, next) => {
    const id = req.params.order_id;

    Order
        .findById(id)
        .populate('product', '-__v')
        .exec()
        .then(result => {
            if (!result) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        message: "Order not found"
                    });
            }
            res
                .status(200)
                .json({
                    ...omit(result._doc, '__v'),
                    request: {
                        type: "GET",
                        url: "http://" + process.env.APP_URL + "/orders"
                    },
                    success: true,
                    message: 'Successfully fetched item.'
                });
        })
        .catch(err => {
            res
                .status(500)
                .json({
                    error: err,
                    success: false,
                });
        });
};

exports.create = (req, res, next) => {
    Product
        .findById(req.body.product_id)
        .then(product => {
            if (!product) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        message: "Product not found."
                    });

            }
            const order = new Order({
                _id: mongoose
                    .Types
                    .ObjectId(),
                quantity: req.body.quantity,
                product: req.body.product_id
            })
            return order
                .save()
                .then(result => {
                    res
                        .status(201)
                        .json({
                            ...omit(result._doc, '__v'),
                            request: {
                                type: "GET",
                                url: "http://" + process.env.APP_URL + "/orders/" + result._id
                            },
                            success: true,
                            message: 'Successfully created order.'
                        });
                })
        })
        .catch(err => {
            res
                .status(500)
                .json({
                    message: "Product not found.",
                    error: err,
                    success: false
                })
        })
};

exports.update = (req, res, next) => {
    res
        .status(200)
        .json({
            success: true,
            message: 'Orders was PATCHED.',
            order_id: req.params.order_id
        });
};

exports.delete = (req, res, next) => {
    const id = req.params.order_id
    Order
        .remove({
            _id: id
        })
        .exec()
        .then(result => {
            res
                .status(200)
                .json({
                    _id: id,
                    request: {
                        type: "POST",
                        url: "http://" + process.env.APP_URL + "/orders",
                        body: {
                            product_id: "String",
                            quantity: "Number"
                        }
                    },
                    success: true,
                    message: "Successfully deleted item."
                })
        })
        .catch(err => {
            res
                .status(400)
                .json({
                    success: false,
                    error: err
                })
        })
}

exports.delete_all = (req, res, next) => {
    Order
        .remove({})
        .exec()
        .then(result => {
            res
                .status(200)
                .json({
                    _id: id,
                    request: {
                        type: "POST",
                        url: "http://" + process.env.APP_URL + "/orders",
                        body: {
                            product_id: "String",
                            quantity: "Number"
                        }
                    },
                    success: true,
                    message: "Successfully all deleted items."
                })
        })
        .catch(err => {
            res
                .status(400)
                .json({
                    error: err,
                    success: false,
                })
        })
}