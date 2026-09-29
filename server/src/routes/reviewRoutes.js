const express = require('express');
const { createReview, getServiceReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createReview);
router.get('/service/:serviceId', getServiceReviews);

module.exports = router;
