const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    await usersCollection.deleteOne({ email: 'admin@MK.com' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123456', salt);

    await usersCollection.insertOne({
      name: 'MK Admin',
      email: 'admin@MK.com',
      password: hashedPassword,
      isAdmin: true,
      isVerified: true, // Admin ko verification ki zaroorat nahi
      phone: '',
      address: '',
      city: '',
      avatar: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('✅ Admin created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();