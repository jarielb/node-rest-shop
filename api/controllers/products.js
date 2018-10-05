const mongoose = require('mongoose');

const {omit} = require('../../helpers');

const Order = require('../models/orders');
const Product = require('../models/products');

exports.get_all = (req, res, next) => {
    Product
        .find()
        .select('-__v')
        .exec()
        .then(docs => {
            const response = {
                total: docs.length,
                docs: docs.map(doc => {
                    return {
                        ...doc._doc,
                        image: process.env.APP_URL + "/" + doc._doc.image,
                        request: {
                            type: 'GET',
                            url: "http://" + process.env.APP_URL + "/products/" + doc._id
                        }
                    }
                }),
                success: true,
                message: 'Successfully fetched items.'
            }
            res
                .status(200)
                .json(response);
        })
        .catch(err => {
            res
                .status(500)
                .json({
                    error: err,
                    success: false,
                })
        })
};

exports.get = (req, res, next) => {
    const id = req.params.product_id;
    Product
        .findById(id)
        .exec()
        .then(result => {
            if(result) {
                res
                    .status(200)
                    .json({
                        ...omit(result._doc, ['__v']),
                        image: process.env.APP_URL + "/" + result._doc.image,
                        request: {
                            type: "GET",
                            url: "http://" + process.env.APP_URL + "/products"
                        },
                        success: true,
                        message: 'Successfully fetched item.'
                    });
            } else {
                res
                    .status(404)
                    .json({
                        _id: id,
                        message: 'No valid entry found for provided ID.',
                        success: false,
                    });
            }

        })
        .catch(err => {
            res
                .status(500)
                .json({ error: err, success: false });
        });
};

exports.create = (req, res, next) => {
    const product = new Product({
        _id: new mongoose
            .Types
            .ObjectId(),
        name: req.body.name,
        price: req.body.price,
        image: req.file.path
    })
    product
        .save()
        .then(result => {
            res
                .status(201)
                .json({
                    ...omit(result._doc, ['__v']),
                    request: {
                        type: "GET",
                        url: "http://" + process.env.APP_URL + "/products" + result._id
                    },
                    success: true,
                    message: 'Successfully created product.'
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
}

exports.update = (req, res, next) => {
    const id = req.params.product_id;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Product.update({
        _id: id
    }, { $set: updateOps })
        .exec()
        .then(result => {
            res
                .status(200)
                .json({
                    _id: id,
                    request: {
                        type: "GET",
                        url: "http://" + process.env.APP_URL + "/products/" + id
                    },
                    success: true,
                    message: 'Successfully updated item.'
                });
        })
        .catch(err => {
            res
                .status(500)
                .json({
                    error: err,
                    success: false,
                })
        })
};

exports.delete = (req, res, next) => {
    const id = req.params.product_id;
    Product
        .remove({ _id: id })
        .exec()
        .then(result => {
            res
                .status(200)
                .json({
                    request: {
                        type: "POST",
                        url: "http://" + process.env.APP_URL + "/products",
                        body: {
                            name: "String",
                            price: "Number"
                        }
                    },
                    success: true,
                    message: "Successfully deleted item."
                });
        })
        .catch(err => {
            res
                .status(404)
                .json({
                    error: err,
                    success: false,
                })
        });
}

exports.delete_all = (req, res, next) => {
    Product
        .remove({})
        .exec()
        .then(result => {
            res
                .status(200)
                .json({
                    request: {
                        type: "POST",
                        url: "http://" + process.env.APP_URL + "/products",
                        body: {
                            name: "String",
                            price: "Number"
                        }
                    },
                    success: true,
                    message: "Successfully deleted items."
                });
        })
        .catch(err => {
            res
                .status(404)
                .json({
                    error: err,
                    success: false,
                })
        });
}
