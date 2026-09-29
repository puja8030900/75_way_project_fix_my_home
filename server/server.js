require('dotenv').config();
const connectDB = require('./src/config/db');
const app = require('./src/app');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

// Connect to database and seed admin
connectDB().then(async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const adminExists = await User.findOne({ email: adminEmail });
      if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', salt);
        await User.create({
          name: 'Super Admin',
          email: adminEmail,
          passwordHash,
          phone: '0000000000',
          role: 'admin',
          isVerified: true,
          isActive: true
        });
        console.log('Super Admin account created successfully!');
      }
    }
  } catch (error) {
    console.error('Failed to seed Super Admin:', error);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
