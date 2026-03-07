const mongoose = require("mongoose");

const connectDB = async () => {
  try {

    const mongoURI =
      process.env.MONGO_URI ||
      "mongodb://admin:password@mongodb:27017/devopsdb?authSource=admin";

    await mongoose.connect(mongoURI);

    console.log("MongoDB Connected");

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
