require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const products = [
  { name: "Wireless Bluetooth Headphones", description: "Premium noise-cancelling wireless headphones with 30-hour battery life", price: 79.99, category: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e", stock: 50, rating: 4.5 },
  { name: "Smart Watch Pro", description: "Fitness tracker with heart rate monitor, GPS, and water resistance", price: 199.99, category: "Electronics", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30", stock: 30, rating: 4.3 },
  { name: "Leather Jacket", description: "Genuine leather jacket with classic design, perfect for casual wear", price: 149.99, category: "Fashion", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5", stock: 20, rating: 4.7 },
  { name: "Running Shoes", description: "Lightweight breathable running shoes with cushioned sole", price: 89.99, category: "Fashion", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", stock: 45, rating: 4.6 },
  { name: "Sunglasses Premium", description: "UV protection sunglasses with polarized lenses", price: 59.99, category: "Accessories", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f", stock: 60, rating: 4.2 },
  { name: "Handbag Classic", description: "Stylish leather handbag with multiple compartments", price: 129.99, category: "Accessories", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3", stock: 25, rating: 4.4 },
  { name: "Desk Lamp Modern", description: "LED desk lamp with adjustable brightness and USB charging port", price: 45.99, category: "Home", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c", stock: 35, rating: 4.1 },
  { name: "Coffee Maker Deluxe", description: "Programmable coffee maker with thermal carafe", price: 89.99, category: "Home", image: "https://images.unsplash.com/photo-1517668808822-c6b024d3a615", stock: 15, rating: 4.8 },
  { name: "JavaScript Guide Book", description: "Comprehensive guide to modern JavaScript programming", price: 34.99, category: "Books", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c", stock: 100, rating: 4.9 },
  { name: "Python Programming Book", description: "Learn Python from beginner to advanced level", price: 39.99, category: "Books", image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353", stock: 80, rating: 4.6 },
  { name: "Wireless Charging Pad", description: "Fast wireless charging pad compatible with all Qi-enabled devices", price: 29.99, category: "Electronics", image: "https://images.unsplash.com/photo-1591815302525-756a9bcc3425", stock: 70, rating: 4.0 },
  { name: "Wrist Watch Elegant", description: "Classic analog wrist watch with stainless steel band", price: 159.99, category: "Accessories", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314", stock: 18, rating: 4.5 }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    await Product.deleteMany({});
    console.log("Products cleared");
    await Product.insertMany(products);
    console.log("Products seeded successfully");
    const adminExists = await User.findOne({ email: "admin@example.com" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({ name: "Admin", email: "admin@example.com", password: hashedPassword, role: "admin" });
      console.log("Admin user created: admin@example.com / admin123");
    } else {
      console.log("Admin user already exists");
    }
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
