const mongoose = require("mongoose");
const { env } = require("./env");

const connectToDatabase = async () => {
  await mongoose.connect(env.mongodbUri);
};

module.exports = { connectToDatabase };
