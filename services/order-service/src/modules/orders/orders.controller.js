import ordersService from "./orders.service.js";

const getOrders = async (_req, res, next) => {
  try {
    const orders = await ordersService.getOrders();
    return res.status(200).json({ data: orders });
  } catch (error) {
    return next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await ordersService.getOrderById(req.params.id);
    return res.status(200).json({ data: order });
  } catch (error) {
    return next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const order = await ordersService.createOrder(req.body);
    return res.status(201).json({ data: order });
  } catch (error) {
    return next(error);
  }
};

const importOrder = async (req, res, next) => {
  try {
    const importResult = await ordersService.importOrder(req.body);
    return res.status(202).json({ data: importResult });
  } catch (error) {
    return next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const order = await ordersService.updateOrder(req.params.id, req.body);
    return res.status(200).json({ data: order });
  } catch (error) {
    return next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    await ordersService.deleteOrder(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

export default {
  getOrders,
  getOrderById,
  createOrder,
  importOrder,
  updateOrder,
  deleteOrder
};
