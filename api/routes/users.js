const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const UsersController = require('../controllers/users')

router.get('/', UsersController.get_all);

router.get('/profile/:id', checkAuth, UsersController.get)

router.get('/profile', checkAuth, UsersController.profile)

router.post('/signup', UsersController.signup)

router.post('/login', UsersController.login)

router.delete('/:id', checkAuth, UsersController.login)

module.exports = router;