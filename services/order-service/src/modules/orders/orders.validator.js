import { body, param } from "express-validator";

const mongoIdRule = param("id").isMongoId().withMessage("id must be a MongoDB ObjectId");

const orderBaseRules = [
  body("customer.name")
    .isString()
    .notEmpty()
    .withMessage("customer.name is required"),
  body("customer.email").isEmail().withMessage("customer.email must be valid"),
  body("lineItems")
    .isArray({ min: 1 })
    .withMessage("lineItems must be a non-empty array"),
  body("lineItems.*.name")
    .isString()
    .notEmpty()
    .withMessage("lineItems[].name is required"),
  body("lineItems.*.quantity")
    .isInt({ min: 1 })
    .withMessage("lineItems[].quantity must be >= 1"),
  body("lineItems.*.price")
    .isFloat({ min: 0 })
    .withMessage("lineItems[].price must be >= 0"),
  body("currency")
    .optional()
    .isString()
    .isLength({ min: 3, max: 3 })
    .withMessage("currency must be a 3-letter code")
];

export const getOrderByIdRules = [mongoIdRule];

export const createOrderRules = [...orderBaseRules];

export const importOrderRules = [
  body("importId").isString().notEmpty().withMessage("importId is required"),
  body("order").isObject().withMessage("order object is required"),
  body("order.customer.name")
    .isString()
    .notEmpty()
    .withMessage("order.customer.name is required"),
  body("order.customer.email")
    .isEmail()
    .withMessage("order.customer.email must be valid"),
  body("order.lineItems")
    .isArray({ min: 1 })
    .withMessage("order.lineItems must be non-empty array"),
  body("order.lineItems.*.name")
    .isString()
    .notEmpty()
    .withMessage("order.lineItems[].name is required"),
  body("order.lineItems.*.quantity")
    .isInt({ min: 1 })
    .withMessage("order.lineItems[].quantity must be >= 1"),
  body("order.lineItems.*.price")
    .isFloat({ min: 0 })
    .withMessage("order.lineItems[].price must be >= 0")
];

export const updateOrderRules = [
  mongoIdRule,
  body("status")
    .optional()
    .isIn(["pending", "completed", "failed"])
    .withMessage("status must be pending|completed|failed"),
  body("processedAt").optional().isISO8601().withMessage("processedAt must be ISO date"),
  body("error").optional().isString().withMessage("error must be string")
];

// (named exports above)
