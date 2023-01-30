const express = require('express');
const router = express.Router();

const { summarize, paragraph, chatbot, jsConverter, scifi} = require('../controllers/openai');

router.route("/summary").post(summarize);
router.route("/paragraph").post(paragraph);
router.route("/chatbot").post(chatbot);
router.route("/js-convert").post(jsConverter);
router.route("/scifi-img").post(scifi);

module.exports = router;