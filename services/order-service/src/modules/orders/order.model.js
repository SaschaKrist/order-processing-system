import mongoose from "mongoose";

const lineItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    importId: { type: String, default: null },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending"
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true }
    },
    lineItems: { type: [lineItemSchema], default: [] },
    totalAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "EUR" },
    processedAt: { type: Date, default: null },
    error: { type: String, default: null }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Order", orderSchema);
