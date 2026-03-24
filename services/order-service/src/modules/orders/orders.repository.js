const Order = require("./order.model");

const findAll = async () => Order.find().sort({ createdAt: -1 });

const findById = async (id) => Order.findById(id);

const create = async (payload) => Order.create(payload);

const updateById = async (id, payload) =>
  Order.findByIdAndUpdate(id, payload, { new: true });

const deleteById = async (id) => Order.findByIdAndDelete(id);

module.exports = {
  findAll,
  findById,
  create,
  updateById,
  deleteById
};
