const express = require("express");
const helmet = require("helmet");

const ordersRoutes = require("./modules/orders/orders.routes");
const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");

const app = express();

app.use(helmet());
app.use(express.json());

app.use("/orders", ordersRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
