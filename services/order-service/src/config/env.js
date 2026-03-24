const dotenv = require("dotenv");

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3001,
  mongodbUri: process.env.MONGODB_URI || ""
};

if (!env.mongodbUri) {
  throw new Error("MONGODB_URI is required");
}

module.exports = { env };
