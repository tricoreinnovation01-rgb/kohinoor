import mongoose, { Schema, type InferSchemaType } from "mongoose";

const ArtworkSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, required: true },
    publicId: { type: String, default: "" },
    category: {
      type: String,
      required: true,
      enum: ["painting", "sketch", "digital", "sculpture", "photography", "mixed"],
    },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    sold: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ArtworkSchema.index({ category: 1, tags: 1 });
ArtworkSchema.index({ sold: 1, category: 1, createdAt: -1 });
ArtworkSchema.index({ featured: 1, sold: 1, createdAt: -1 });
ArtworkSchema.index({ title: "text", description: "text", tags: "text" });

export type ArtworkDoc = InferSchemaType<typeof ArtworkSchema> & {
  _id: mongoose.Types.ObjectId;
};

export default mongoose.models.Artwork ?? mongoose.model("Artwork", ArtworkSchema);
