const ordersRepository = require("./orders.repository");

const getOrders = async () => ordersRepository.findAll();

const getOrderById = async (id) => {
  const order = await ordersRepository.findById(id);
  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }
  return order;
};

const createOrder = async (payload) => {
  const totalAmount = payload.lineItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const orderData = {
    ...payload,
    totalAmount,
    status: payload.status || "pending"
  };

  return ordersRepository.create(orderData);
};

const importOrder = async (payload) => {
  const orderData = {
    ...payload.order,
    importId: payload.importId,
    status: "pending"
  };

  const createdOrder = await ordersRepository.create(orderData);

  return {
    importId: payload.importId,
    orderId: createdOrder.orderId,
    status: "accepted"
  };
};

const updateOrder = async (id, payload) => {
  const updated = await ordersRepository.updateById(id, payload);
  if (!updated) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }
  return updated;
};

const deleteOrder = async (id) => {
  const deleted = await ordersRepository.deleteById(id);
  if (!deleted) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  importOrder,
  updateOrder,
  deleteOrder
};
