const express = require('express');
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getProviderMyBookings,
  updateBookingStatus,
  assignProvider
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, authorize('customer'), createBooking);

router.get('/my', protect, authorize('customer'), getMyBookings);
router.get('/provider/my', protect, authorize('provider'), getProviderMyBookings);

router.route('/:id')
  .get(protect, getBookingById);

router.patch('/:id/cancel', protect, authorize('customer'), cancelBooking);
router.patch('/:id/status', protect, authorize('provider', 'admin'), updateBookingStatus);
router.patch('/:id/assign', protect, authorize('admin'), assignProvider);

module.exports = router;
