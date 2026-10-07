const jwt = require('jsonwebtoken');
const { User, Vendor } = require('../models');
const { sendWelcomeEmail } = require('../services/emailService');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d'
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Create user (role can be customer or vendor; prevent assigning admin directly)
    const userRole = role === 'vendor' ? 'vendor' : 'customer';

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: userRole,
      phone: phone || ''
    });

    // Send Welcome Email
    sendWelcomeEmail({
      email: user.email,
      name: user.name
    }).catch(err => console.warn('Welcome email could not be sent:', err.message));

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        token
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration'
    });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and include password field for comparison
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // If user is a vendor, fetch vendor profile if it exists
    let vendorInfo = null;
    if (user.role === 'vendor') {
      vendorInfo = await Vendor.findOne({ user: user._id }).select('_id storeName slug status');
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        vendor: vendorInfo,
        token
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login'
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let vendorInfo = null;
    if (user.role === 'vendor') {
      vendorInfo = await Vendor.findOne({ user: user._id });
    }

    return res.status(200).json({
      success: true,
      data: {
        user,
        vendor: vendorInfo
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching profile'
    });
  }
};

/**
 * @desc    Update current user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { name, phone, avatar, addresses } = req.body;

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;
    if (addresses !== undefined) user.addresses = addresses;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating profile'
    });
  }
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match'
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error changing password'
    });
  }
};

/**
 * @desc    Authenticate or sync user via Google OAuth
 * @route   POST /api/auth/google
 * @access  Public
 */
const googleAuth = async (req, res) => {
  try {
    const { name, email, avatar, role } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Google email is required'
      });
    }

    let user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      const userRole = role === 'vendor' ? 'vendor' : 'customer';
      user = await User.create({
        name: name || 'Google User',
        email: email.toLowerCase().trim(),
        password: Math.random().toString(36).slice(-8) + 'Ab1!',
        avatar: avatar || '',
        role: userRole
      });
    }

    let vendorInfo = null;
    if (user.role === 'vendor') {
      vendorInfo = await Vendor.findOne({ user: user._id }).select('_id storeName slug status');
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        vendor: vendorInfo,
        token
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Google authentication failed'
    });
  }
};

module.exports = {
  generateToken,
  register,
  login,
  googleAuth,
  getProfile,
  updateProfile,
  changePassword
};
