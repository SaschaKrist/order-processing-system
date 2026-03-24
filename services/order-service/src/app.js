import express from "express";
import helmet from "helmet";

import ordersRoutes from "./modules/orders/orders.routes.js";
import notFoundMiddleware from "./middlewares/not-found.js";
import errorHandlerMiddleware from "./middlewares/error-handler.js";

const app = express();

app.use(helmet());
app.use(express.json());

app.use("/orders", ordersRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
