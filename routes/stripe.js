const express = require('express');
const { protect } = require('../middleware/auth');
const router = express.Router();

const { createCheckout, createWebhook, createPortal } = require('../controllers/stripe');

router.post("/checkout", protect, createCheckout);
router.post("/webhook", createWebhook);
router.post("/portal", createPortal);

module.exports = router;