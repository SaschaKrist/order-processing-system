import express from "express";

import ordersController from "./orders.controller.js";
import validateRequest from "#middlewares/validate-request";
import {
  getOrderByIdRules,
  createOrderRules,
  importOrderRules,
  updateOrderRules
} from "./orders.validator.js";

const router = express.Router();



router.get("/", ordersController.getOrders);
router.get("/:id", getOrderByIdRules, validateRequest, ordersController.getOrderById);
router.post("/", createOrderRules, validateRequest, ordersController.createOrder);
router.post(
  "/import",
  importOrderRules,
  validateRequest,
  ordersController.importOrder
);
router.patch("/:id", updateOrderRules, validateRequest, ordersController.updateOrder);
router.delete("/:id", getOrderByIdRules, validateRequest, ordersController.deleteOrder);

export default router;
