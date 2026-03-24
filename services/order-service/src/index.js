const app = require("./app");
const { connectToDatabase } = require("./config/db");
const { env } = require("./config/env");

const start = async () => {
  await connectToDatabase();
  app.listen(env.port, () => {
    console.log(`Order service listening on port ${env.port}`);
  });
};

start().catch((error) => {
  console.error("Failed to start order service:", error);
  process.exit(1);
});
