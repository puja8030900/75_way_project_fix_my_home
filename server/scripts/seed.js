require('dotenv').config({ path: '../.env.example' }); // using .env.example since we don't have a real .env yet
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const Service = require('../src/models/Service');
const connectDB = require('../src/config/db');

// Sample Services Data
const servicesData = [
  {
    name: 'Basic Plumbing Repair',
    description: 'Fixing leaks, unclogging drains, and minor pipe repairs.',
    category: 'Plumbing',
    price: 50,
    estimatedDuration: '1-2 hours',
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'AC Servicing',
    description: 'Complete cleaning and gas check for split or window ACs.',
    category: 'AC Repair and Servicing',
    price: 80,
    estimatedDuration: '2 hours',
    image: 'https://images.unsplash.com/photo-1527689638836-411945a2b57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Electrical Switch Repair',
    description: 'Repair or replace faulty switches and sockets safely.',
    category: 'Electrical Repairs',
    price: 40,
    estimatedDuration: '1 hour',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Deep Home Cleaning',
    description: 'Thorough cleaning of all rooms, bathrooms, and kitchen.',
    category: 'Home Cleaning',
    price: 150,
    estimatedDuration: '5-6 hours',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  }
];

const seedData = async () => {
  try {
    // If you haven't set MONGODB_URI in your .env, the seed will fail.
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI === 'your_mongodb_atlas_connection_string') {
      console.log("Please update MONGODB_URI in your .env.example or .env to a real string to seed.");
      process.exit(0);
    }
    
    await connectDB();

    await User.deleteMany();
    await Service.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // Create Admin
    await User.create({
      name: 'Admin User',
      email: 'admin@fixmyhome.com',
      passwordHash,
      phone: '1234567890',
      role: 'admin',
    });

    // Create Provider
    await User.create({
      name: 'John the Plumber',
      email: 'john@fixmyhome.com',
      passwordHash,
      phone: '0987654321',
      role: 'provider',
    });

    // Create Customer
    await User.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      passwordHash,
      phone: '1122334455',
      role: 'customer',
      address: '123 Main St, Cityville',
    });

    // Insert Services
    await Service.insertMany(servicesData);

    console.log('Data Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
