import app from "./app.js";
import { connectToDatabase } from "./config/db.js";
import { env } from "./config/env.js";

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
