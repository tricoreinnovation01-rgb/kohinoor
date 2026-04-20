import mongoose, { Schema, type InferSchemaType } from "mongoose";

const CustomerSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true },
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    stripeCustomerId: { type: String, default: "" },
  },
  { timestamps: true }
);

CustomerSchema.index({ email: 1 }, { unique: true });

export type CustomerDoc = InferSchemaType<typeof CustomerSchema> & {
  _id: mongoose.Types.ObjectId;
};

export default mongoose.models.Customer ?? mongoose.model("Customer", CustomerSchema);
