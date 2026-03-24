import test, { afterEach, beforeEach, describe } from "node:test";
import assert from "node:assert/strict";

import ordersService from "./orders.service.js";
import ordersRepository from "./orders.repository.js";

let originalCreate;
let createMockImpl;
let mockOrder;
let originalFindById;
let findByIdMockImpl;
let originalUpdateById;
let updateByIdMockImpl;
let originalDeleteById;
let deleteByIdMockImpl;

describe("ordersService", () => {
  describe("createOrder", () => {
    beforeEach(() => {
      originalCreate = ordersRepository.create;
      createMockImpl = async (orderData) => orderData;
      ordersRepository.create = async (orderData) => createMockImpl(orderData);
      mockOrder = {
        _id: "order-1",
        lineItems: [
          { sku: "A", price: 10, quantity: 2 },
          { sku: "B", price: 5, quantity: 3 }
        ]
      };
    });

    afterEach(() => {
      ordersRepository.create = originalCreate;
    });

    test("returns the correct order", async () => {
      const result = await ordersService.createOrder(mockOrder);
      assert.partialDeepStrictEqual(result, mockOrder);
    });

    test("sets status to pending if not provided", async () => {
      const result = await ordersService.createOrder(mockOrder);
      assert.equal(result.status, "pending");
    });

    test("sets status from payload if provided", async () => {
      const result = await ordersService.createOrder({ ...mockOrder, status: "completed" });
      assert.equal(result.status, "completed");
    });

    test("calculates totalAmount if lineItems", async () => {
      const result = await ordersService.createOrder(mockOrder);
      assert.equal(result.totalAmount, 35);
    });

    test("calculates totalAmount if lineItems is empty", async () => {
      const result = await ordersService.createOrder({ ...mockOrder, lineItems: [] });
      assert.equal(result.totalAmount, 0);
    });

  });

  describe("getOrderById", () => {
    beforeEach(() => {
      mockOrder = {
        _id: "order-1",
        lineItems: [
          { sku: "A", price: 10, quantity: 2 },
          { sku: "B", price: 5, quantity: 3 }
        ]
      }
      originalFindById = ordersRepository.findById;
      findByIdMockImpl = async (id) => mockOrder;
      ordersRepository.findById = async (id) => findByIdMockImpl(id);
    });

    afterEach(() => {
      ordersRepository.findById = originalFindById;
    });

    test("returns order when repository finds one", async () => {
      const result = await ordersService.getOrderById(mockOrder._id);
      assert.equal(result, mockOrder);
    });

    test("throws 404 error when order is not found", async () => {
      findByIdMockImpl = async () => null;
      await assert.rejects(
        () => ordersService.getOrderById("missing-id"),
        (error) => {
          assert.equal(error.message, "Order not found");
          assert.equal(error.statusCode, 404);
          return true;
        }
      );
    });
  });

  describe("importOrder", () => {
    beforeEach(() => {
      mockOrder = {
        lineItems: [
          { sku: "A", price: 10, quantity: 2 },
          { sku: "B", price: 5, quantity: 3 }
        ]
      }
      originalCreate = ordersRepository.create;
      createMockImpl = async (orderData) => ({ _id: "created-order-id", ...orderData });
      ordersRepository.create = async (orderData) => createMockImpl(orderData);
    });

    afterEach(() => {
      ordersRepository.create = originalCreate;
    });

    test("returns import result", async () => {
      const result = await ordersService.importOrder({ importId: "import-1", order: mockOrder });
      assert.deepEqual(result, { importId: "import-1", id: "created-order-id", status: "accepted" });
    });

  });

  describe("updateOrder", () => {
    beforeEach(() => {
      originalUpdateById = ordersRepository.updateById;
      updateByIdMockImpl = async (id, payload) => ({ _id: id, ...payload });
      ordersRepository.updateById = async (id, payload) => updateByIdMockImpl(id, payload);
    });

    afterEach(() => {
      ordersRepository.updateById = originalUpdateById;
    });

    test("returns updated order", async () => {
      const result = await ordersService.updateOrder("order-55", { status: "completed" });
      assert.deepEqual(result, { _id: "order-55", status: "completed" });
    });

    test("throws 404 error when order is not found", async () => {
      updateByIdMockImpl = async () => null;
      await assert.rejects(
        () => ordersService.updateOrder("missing-id", { status: "completed" }),
        (error) => {
          assert.equal(error.message, "Order not found");
          assert.equal(error.statusCode, 404);
          return true;
        }
      );
    });
  });

  describe("deleteOrder", () => {
    beforeEach(() => {
      originalDeleteById = ordersRepository.deleteById;
      deleteByIdMockImpl = async () => ({ _id: "order-1" });
      ordersRepository.deleteById = async (id) => deleteByIdMockImpl(id);
    });

    afterEach(() => {
      ordersRepository.deleteById = originalDeleteById;
    });

    test("resolves when repository deletes an order", async () => {
      const result = await ordersService.deleteOrder("order-1");
      assert.equal(result, undefined);
    });

    test("throws 404 error when order is not found", async () => {
      deleteByIdMockImpl = async () => null;
      await assert.rejects(
        () => ordersService.deleteOrder("missing-id"),
        (error) => {
          assert.equal(error.message, "Order not found");
          assert.equal(error.statusCode, 404);
          return true;
        }
      );
    });
  });
});