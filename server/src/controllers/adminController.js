const User = require('../models/User');
const Booking = require('../models/Booking');
const Service = require('../models/Service');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProviders = await User.countDocuments({ role: 'provider' });
    const totalServices = await Service.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    const pendingBookings = await Booking.countDocuments({ status: 'Pending' });
    const completedBookings = await Booking.countDocuments({ status: 'Completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'Cancelled' });

    const completed = await Booking.find({ status: 'Completed' });
    const revenue = completed.reduce((acc, curr) => acc + curr.price, 0);

    res.json({
      totalCustomers,
      totalProviders,
      totalServices,
      totalBookings,
      pendingBookings,
      completedBookings,
      cancelledBookings,
      revenue
    });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'customer' }).select('-passwordHash');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.getProviders = async (req, res, next) => {
  try {
    const providers = await User.find({ role: 'provider' }).select('-passwordHash');
    res.json(providers);
  } catch (error) {
    next(error);
  }
};

exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('serviceId', 'name')
      .populate('customerId', 'name email')
      .populate('providerId', 'name')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Don't allow deleting admins
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
