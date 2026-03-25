import express from "express";
import helmet from "helmet";

import ordersRoutes from "#modules/orders/orders.routes";
import notFoundMiddleware from "#middlewares/not-found";
import errorHandlerMiddleware from "#middlewares/error-handler";

const app = express();

app.use(helmet());
app.use(express.json());

app.use("/orders", ordersRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
