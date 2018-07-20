const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Users = require('../models/users');
const {toProperCase, omit} = require('../../helpers');

exports.get_all = (req, res, next) => {
    Users
        .find()
        .select('-__v')
        .exec()
        .then(docs => {
            const response = {
                total: docs.length,
                docs: docs.map(doc => {
                    return {
                        ...doc._doc,
                        request: {
                            type: 'GET',
                            url: "http://" + process.env.APP_URL + "/user/" + doc._id
                        }
                    }
                }),
                message: 'Users were fetched.'
            }
            res
                .status(200)
                .json(response);
        })
        .catch(err => {
            res
                .status(500)
                .json({
                    error: err
                })
        })
};

exports.get = (req, res, next) => {
    const id = req.params.id;
    Users
        .findById(id)
        .exec()
        .then(result => {
            if(result) {
                res
                .status(200)
                .json({
                    ...omit(result._doc, ['password', '__v']),
                    request: {
                        type: 'GET',
                        url: "http://" + process.env.APP_URL + "/user",
                    },
                    success: true,
                    message: 'User were fetched.'
                });
            }  else {
                res
                    .status(404)
                    .json({
                        _id: id,
                        success: false,
                        message: 'No users found.',
                    });
            }
        })
};

exports.profile = (req, res, next) => {
    const id = req.user_data.user_id
    Users
        .findById(id)
        .exec()
        .then(result => {
            if(result) {
                res
                .status(200)
                .json({
                    ...omit(result._doc, ['password', '__v']),
                    request: {
                        type: 'GET',
                        url: "http://" + process.env.APP_URL + "/user",
                    },
                    success: true,
                    message: 'User were fetched.'
                });
            }  else {
                res
                    .status(404)
                    .json({
                        _id: id,
                        success: false,
                        message: 'No users found.',
                    });
            }
        })
};

exports.signup = (req, res, next) => {
    const email = req.body.email.toLowerCase();
    const first_name = toProperCase(req.body.first_name);
    const last_name = toProperCase(req.body.last_name);
    Users
    .find({email: email})
    .exec()
    .then(user => {
        if(user.length >= 1) {
            return res
                .status(409)
                .json({
                    message: "Email exist"
                });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new Users({
                        _id: new mongoose.Types.ObjectId(),
                        first_name,
                        last_name,
                        email,
                        password: hash,
                        
                    })
                    user
                        .save()
                        .then(result => {
                            res.status(201).json({
                                message: "User created"
                            })
                        })
                        .catch(err => {
                            res.status(500).json({
                                error: err
                            });
                        })
                }
            })
    }
    })
};

exports.login = (req, res, next) => {
    const email = req.body.email.toLowerCase();
    Users
    .find({email: email})
    .exec()
    .then(user => {
        if(user.length < 1) {
            return res
                .status(400)
                .json({
                    message: "Login failed",
                    status: 400
                });
        };
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err) {
                return res.status(400).json({
                    message: "Login failed",
                    status: 400
                })
            }
            if(result) {
                const token = jwt.sign({
                    email: user[0].email,
                    user_id: user[0]._id
                }, 
                process.env.JWT_KEY,
                {
                    expiresIn: "2d",                    
                }
            );
                const token_expire = new Date();
                token_expire.setDate(token_expire.getDate() + 2)
                return res.status(200).json({
                    doc: {
                        first_name: user[0].first_name,
                        last_name: user[0].last_name,
                        token,
                        token_expire,
                    },
                    message: "Login successful",
                    success: true,
                    status: 200,
                })
            }
            return res.status(400).json({
                message: "Login failed",
                status: 400
            })
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

exports.delete = (req, res, next) => {
    Users
        .remove({_id: req.params.user_id})
        .exec()
        .then(result => {
            res
                .status(200)
                .json({
                    _id: req.params.user_id,
                    message: "Successfully delete user"
                })
        })
        .catch(err => {
            res
                .status(400)
                .json({
                    error: err
                })
        })
};