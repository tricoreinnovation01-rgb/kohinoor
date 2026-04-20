import mongoose, { Schema, type InferSchemaType } from "mongoose";

const OrderItemSchema = new Schema(
  {
    artworkId: { type: Schema.Types.ObjectId, ref: "Artwork", required: true },
    title: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    imageUrl: { type: String, default: "" },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    customerEmail: { type: String, required: true, lowercase: true },
    customerName: { type: String, default: "" },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    stripeSessionId: { type: String, default: "" },
    stripePaymentIntentId: { type: String, default: "" },
  },
  { timestamps: true }
);

OrderSchema.index({ stripeSessionId: 1 });
OrderSchema.index({ createdAt: -1 });

export type OrderDoc = InferSchemaType<typeof OrderSchema> & {
  _id: mongoose.Types.ObjectId;
};

export default mongoose.models.Order ?? mongoose.model("Order", OrderSchema);
