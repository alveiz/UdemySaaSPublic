const express = require('express');
const { protect } = require('../middleware/auth');
const router = express.Router();

const { register, login, logout, getRefreshToken, getSubscription, getCustomer } = require('../controllers/auth');

router.post("/register", register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/refresh-token',getRefreshToken);
router.get('/subscription', protect, getSubscription);
router.get('/customer', protect, getCustomer);

module.exports = router;