const express = require('express');
const { 
  getDashboardStats, 
  getUsers, 
  getProviders, 
  getAllBookings,
  deleteUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/providers', getProviders);
router.get('/bookings', getAllBookings);

module.exports = router;
