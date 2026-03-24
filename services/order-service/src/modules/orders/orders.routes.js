const express = require("express");

const ordersController = require("./orders.controller");
const validateRequest = require("../../middlewares/validate-request");
const {
  getOrderByIdRules,
  createOrderRules,
  importOrderRules,
  updateOrderRules
} = require("./orders.validator");

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

module.exports = router;
