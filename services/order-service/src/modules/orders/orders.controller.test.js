import test, { afterEach, beforeEach, describe } from "node:test";
import assert from "node:assert/strict";

import ordersController from "./orders.controller.js";
import ordersService from "./orders.service.js";

function createResSpy() {
  const calls = { status: [], json: [], send: [] };
  const res = {
    status(code) {
      calls.status.push(code);
      return {
        json(data) {
          calls.json.push(data);
          return this;
        },
        send() {
          calls.send.push(undefined);
        }
      };
    }
  };
  return { res, calls };
}

describe("ordersController", () => {
  describe("getOrders", () => {
    let originalGetOrders;
    let getOrdersImpl;
    let res;
    let calls;

    beforeEach(() => {
      originalGetOrders = ordersService.getOrders;
      getOrdersImpl = async () => [];
      ordersService.getOrders = async () => getOrdersImpl();
      ({ res, calls } = createResSpy());

    });

    afterEach(() => {
      ordersService.getOrders = originalGetOrders;
    });

    test("returns 200 with data", async () => {
      const orders = [{ _id: "1" }];
      getOrdersImpl = async () => orders;
      const next = () => assert.fail("next should not be called");

      await ordersController.getOrders({}, res, next);

      assert.deepEqual(calls.status, [200]);
      assert.deepEqual(calls.json, [{ data: orders }]);
    });

    test("calls next on error", async () => {
      const err = new Error("boom");
      getOrdersImpl = async () => {
        throw err;
      };
      let received;
      const next = (e) => {
        received = e;
      };

      await ordersController.getOrders({}, res, next);

      assert.equal(received, err);
    });
  });

  describe("getOrderById", () => {
    let originalGetOrderById;
    let getOrderByIdImpl;
    let res;
    let calls;

    beforeEach(() => {
      originalGetOrderById = ordersService.getOrderById;
      getOrderByIdImpl = async () => ({});
      ordersService.getOrderById = async (id) => getOrderByIdImpl(id);
      ({ res, calls } = createResSpy());
    });

    afterEach(() => {
      ordersService.getOrderById = originalGetOrderById;
    });

    test("returns 200 with order", async () => {
      const order = { _id: "order-42", status: "pending" };
      getOrderByIdImpl = async (id) => {
        assert.equal(id, order._id);
        return order;
      };
      const req = { params: { id: "order-42" } };
      const next = () => assert.fail("next should not be called");

      await ordersController.getOrderById(req, res, next);

      assert.deepEqual(calls.status, [200]);
      assert.deepEqual(calls.json, [{ data: order }]);
    });

    test("calls next on error", async () => {
      const err = new Error("Order not found");
      err.statusCode = 404;
      getOrderByIdImpl = async () => {
        throw err;
      };
      const req = { params: { id: "x" } };
      let received;
      const next = (e) => {
        received = e;
      };

      await ordersController.getOrderById(req, res, next);

      assert.equal(received, err);
    });
  });

  describe("createOrder", () => {
    let originalCreateOrder;
    let createOrderImpl;
    let res;
    let calls;

    beforeEach(() => {
      originalCreateOrder = ordersService.createOrder;
      createOrderImpl = async () => ({});
      ordersService.createOrder = async (body) => createOrderImpl(body);
      ({ res, calls } = createResSpy());
    });

    afterEach(() => {
      ordersService.createOrder = originalCreateOrder;
    });

    test("returns 201 with created order", async () => {
      const body = { customerId: "c1", lineItems: [] };
      const created = { _id: "new", ...body };
      createOrderImpl = async (b) => {
        assert.deepEqual(b, body);
        return created;
      };
      const req = { body };
      const next = () => assert.fail("next should not be called");

      await ordersController.createOrder(req, res, next);

      assert.deepEqual(calls.status, [201]);
      assert.deepEqual(calls.json, [{ data: created }]);
    });

    test("calls next on error", async () => {
      const err = new Error("validation failed");
      createOrderImpl = async () => {
        throw err;
      };
      const req = { body: {} };
      let received;
      const next = (e) => {
        received = e;
      };

      await ordersController.createOrder(req, res, next);

      assert.equal(received, err);
    });
  });

  describe("importOrder", () => {
    let originalImportOrder;
    let importOrderImpl;
    let res;
    let calls;

    beforeEach(() => {
      originalImportOrder = ordersService.importOrder;
      importOrderImpl = async () => ({});
      ordersService.importOrder = async (body) => importOrderImpl(body);
      const spy = createResSpy();
      res = spy.res;
      calls = spy.calls;
    });

    afterEach(() => {
      ordersService.importOrder = originalImportOrder;
    });

    test("returns 202 with import result", async () => {
      const body = { importId: "imp-1", order: {} };
      const result = { importId: body.importId, id: "id-1", status: "accepted" };
      importOrderImpl = async (b) => {
        assert.deepEqual(b, body);
        return result;
      };
      const req = { body };
      const next = () => assert.fail("next should not be called");

      await ordersController.importOrder(req, res, next);

      assert.deepEqual(calls.status, [202]);
      assert.deepEqual(calls.json, [{ data: result }]);
    });

    test("calls next on error", async () => {
      const err = new Error("import failed");
      importOrderImpl = async () => {
        throw err;
      };
      const req = { body: {} };
      let received;
      const next = (e) => {
        received = e;
      };

      await ordersController.importOrder(req, res, next);

      assert.equal(received, err);
    });
  });

  describe("updateOrder", () => {
    let originalUpdateOrder;
    let updateOrderImpl;
    let res;
    let calls;

    beforeEach(() => {
      originalUpdateOrder = ordersService.updateOrder;
      updateOrderImpl = async () => ({});
      ordersService.updateOrder = async (id, payload) => updateOrderImpl(id, payload);
      const spy = createResSpy();
      res = spy.res;
      calls = spy.calls;
    });

    afterEach(() => {
      ordersService.updateOrder = originalUpdateOrder;
    });

    test("returns 200 with updated order", async () => {
      const body = { status: "completed" };
      const order = { _id: "o1", lineItems: ["test", "test2"] };
      const updated = { ...order, ...body };
      updateOrderImpl = async (id, payload) => {
        assert.equal(id, "o1");
        assert.deepEqual(payload, body);
        return updated;
      };
      const req = { params: { id: "o1" }, body };
      const next = () => assert.fail("next should not be called");

      await ordersController.updateOrder(req, res, next);

      assert.deepEqual(calls.status, [200]);
      assert.deepEqual(calls.json, [{ data: updated }]);
    });

    test("calls next on error", async () => {
      const err = new Error("not found");
      err.statusCode = 404;
      updateOrderImpl = async () => {
        throw err;
      };
      const req = { params: { id: "x" }, body: {} };
      let received;
      const next = (e) => {
        received = e;
      };

      await ordersController.updateOrder(req, res, next);

      assert.equal(received, err);
    });
  });

  describe("deleteOrder", () => {
    let originalDeleteOrder;
    let deleteOrderImpl;
    let res;
    let calls;

    beforeEach(() => {
      originalDeleteOrder = ordersService.deleteOrder;
      deleteOrderImpl = async () => { };
      ordersService.deleteOrder = async (id) => deleteOrderImpl(id);
      const spy = createResSpy();
      res = spy.res;
      calls = spy.calls;
    });

    afterEach(() => {
      ordersService.deleteOrder = originalDeleteOrder;
    });

    test("returns 204 with send", async () => {
      const _id = "to-delete";
      deleteOrderImpl = async (id) => {
        assert.equal(id, _id);
      };
      const req = { params: { id: _id } };
      const next = () => assert.fail("next should not be called");

      await ordersController.deleteOrder(req, res, next);

      assert.deepEqual(calls.status, [204]);
      assert.deepEqual(calls.send, [undefined]);
    });

    test("calls next on error", async () => {
      const err = new Error("not found");
      deleteOrderImpl = async () => {
        throw err;
      };
      const req = { params: { id: "x" } };
      let received;
      const next = (e) => {
        received = e;
      };

      await ordersController.deleteOrder(req, res, next);

      assert.equal(received, err);
    });
  });
});
