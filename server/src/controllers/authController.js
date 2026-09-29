const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email helper
const sendOTPEmail = async (user, otp) => {
  const message = `Your FixMyHome verification OTP is: ${otp}. It will expire in 10 minutes.`;

  await sendEmail({
    email: user.email,
    subject: 'FixMyHome - Email Verification OTP',
    message,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #ffffff; border-radius: 16px; border: 1px solid #f0f0f0;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="background-color: #ea580c; display: inline-block; padding: 12px; border-radius: 12px; margin-bottom: 16px;">
            <span style="font-size: 24px; color: white; font-weight: bold;">🔧</span>
          </div>
          <h2 style="color: #1e293b; margin: 0 0 8px 0; font-size: 24px;">Verify Your Email</h2>
          <p style="color: #64748b; margin: 0; font-size: 14px;">Welcome to FixMyHome, <strong>${user.name}</strong>!</p>
        </div>
        
        <p style="font-size: 15px; color: #334155; text-align: center; margin-bottom: 24px;">
          Use the OTP code below to verify your email address and activate your account.
        </p>
        
        <div style="background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 2px;">Your Verification Code</p>
          <div style="font-size: 36px; font-weight: 800; letter-spacing: 12px; color: white; font-family: 'Courier New', monospace;">${otp}</div>
        </div>
        
        <p style="font-size: 13px; color: #94a3b8; text-align: center; margin-bottom: 0;">
          ⏰ This code will expire in <strong>10 minutes</strong>.<br/>
          If you didn't register on FixMyHome, please ignore this email.
        </p>
      </div>
    `,
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, address } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      // If user exists but is NOT verified, allow re-registration with new OTP
      if (!userExists.isVerified) {
        const otp = generateOTP();
        userExists.otp = otp;
        userExists.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Update user details in case they changed anything
        userExists.name = name;
        const salt = await bcrypt.genSalt(10);
        userExists.passwordHash = await bcrypt.hash(password, salt);
        userExists.phone = phone;
        userExists.role = role || 'customer';
        userExists.address = role !== 'admin' ? address : undefined;

        await userExists.save();

        try {
          await sendOTPEmail(userExists, otp);
          return res.status(200).json({
            message: 'A new OTP has been sent to your email. Please verify to complete registration.',
            email: userExists.email,
          });
        } catch (error) {
          console.error('OTP email could not be sent', error);
          return res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
        }
      }
      return res.status(400).json({ message: 'User already exists and is verified. Please login.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const otp = generateOTP();

    const user = await User.create({
      name,
      email,
      passwordHash,
      phone,
      role: role || 'customer',
      address: role !== 'admin' ? address : undefined,
      otp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    if (user) {
      try {
        await sendOTPEmail(user, otp);

        res.status(201).json({
          message: 'Registration successful! An OTP has been sent to your email.',
          email: user.email,
        });
      } catch (error) {
        console.error('OTP email could not be sent', error);
        res.status(500).json({ message: 'User registered but OTP email could not be sent. Please try resending.' });
      }
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified. Please login.' });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({ message: 'No OTP found. Please register again or resend OTP.' });
    }

    if (new Date() > user.otpExpires) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    // OTP is valid — verify the user
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    next(error);
  }
};

exports.resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found. Please register first.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified. Please login.' });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    try {
      await sendOTPEmail(user, otp);
      res.json({ message: 'A new OTP has been sent to your email.' });
    } catch (error) {
      console.error('OTP email could not be sent', error);
      res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
    }
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      if (!user.isActive) {
        return res.status(401).json({ message: 'Account is deactivated' });
      }

      if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your email address before logging in. Check your inbox for the OTP.' });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, skills, bio } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = name || user.name;
      user.phone = phone || user.phone;
      if (user.role === 'customer' && address) {
        user.address = address;
      }
      if (user.role === 'provider') {
        if (skills) user.skills = skills;
        if (bio) user.bio = bio;
      }

      const updatedUser = await user.save();
      
      const userToReturn = await User.findById(req.user._id).select('-passwordHash');
      res.json(userToReturn);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};
