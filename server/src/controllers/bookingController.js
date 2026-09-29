const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');

exports.createBooking = async (req, res, next) => {
  try {
    const { serviceId, bookingDate, timeSlot, address, phone, problemDescription } = req.body;

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({ message: 'Service not found or inactive' });
    }

    const booking = await Booking.create({
      customerId: req.user._id,
      serviceId,
      bookingDate,
      timeSlot,
      address,
      phone,
      problemDescription,
      price: service.price, // Trust backend price
      status: 'Pending',
    });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customerId: req.user._id })
      .populate('serviceId', 'name image price')
      .populate('providerId', 'name phone')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('serviceId', 'name image price category')
      .populate('providerId', 'name phone')
      .populate('customerId', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check ownership or admin
    if (booking.customerId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin' &&
      (booking.providerId && booking.providerId._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to access this booking' });
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const { cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check ownership
    if (booking.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Allow cancellation only if Pending or Confirmed
    if (!['Pending', 'Confirmed'].includes(booking.status)) {
      return res.status(400).json({ message: 'Booking cannot be cancelled at this stage' });
    }

    booking.status = 'Cancelled';
    booking.cancellationReason = cancellationReason || 'Cancelled by user';
    await booking.save();

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

// Provider methods
exports.getProviderMyBookings = async (req, res, next) => {
  try {
    const providerSkills = req.user.skills || [];

    // Find services matching provider's skills (by category or name)
    const matchingServices = await Service.find({
      $or: [
        { category: { $in: providerSkills } },
        { name: { $in: providerSkills } }
      ]
    }).select('_id');

    const matchingServiceIds = matchingServices.map(s => s._id);

    // Find bookings that are EITHER:
    // 1. Assigned to this provider
    // 2. OR Pending/Unassigned bookings matching the provider's skills
    const query = {
      $or: [
        { providerId: req.user._id },
        {
          $or: [
            { providerId: null },
            { providerId: { $exists: false } }
          ],
          status: 'Pending',
          serviceId: { $in: matchingServiceIds }
        }
      ]
    };

    const bookings = await Booking.find(query)
      .populate('serviceId', 'name image category price')
      .populate('customerId', 'name phone address email')
      .sort('-createdAt');

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Admin can update to any status
    if (req.user.role === 'admin') {
      booking.status = status;
      await booking.save();
      return res.json(booking);
    }

    // Provider logic
    if (req.user.role === 'provider') {
      const isAssignedToMe = booking.providerId && booking.providerId.toString() === req.user._id.toString();
      const isUnassignedPending = (!booking.providerId) && booking.status === 'Pending';

      if (status === 'Cancelled') {
        booking.status = 'Cancelled';
        booking.cancellationReason = req.body.cancellationReason || 'Declined/Cancelled by service provider';
        await booking.save();
        return res.json(booking);
      }

      if (isUnassignedPending && status === 'Accepted') {
        booking.providerId = req.user._id;
        booking.status = 'Accepted';
        await booking.save();
        return res.json(booking);
      }

      if (isAssignedToMe) {
        const allowedTransitions = {
          'Pending': ['Accepted', 'Cancelled'],
          'Assigned': ['Accepted', 'Cancelled'],
          'Accepted': ['In Progress', 'Cancelled'],
          'In Progress': ['Completed', 'Cancelled']
        };

        if (!allowedTransitions[booking.status] || !allowedTransitions[booking.status].includes(status)) {
          return res.status(400).json({ message: `Invalid status transition from ${booking.status} to ${status}` });
        }

        booking.status = status;
        await booking.save();
        return res.json(booking);
      }
    }

    return res.status(403).json({ message: 'Not authorized' });
  } catch (error) {
    next(error);
  }
};

exports.assignProvider = async (req, res, next) => {
  try {
    const { providerId } = req.body;

    // verify provider is a valid active provider
    const provider = await User.findOne({ _id: providerId, role: 'provider', isActive: true });
    if (!provider) {
      return res.status(400).json({ message: 'Invalid or inactive provider' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { providerId, status: 'Assigned' },
      { new: true }
    ).populate('providerId', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};
