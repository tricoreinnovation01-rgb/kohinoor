import mongoose, { Schema, type InferSchemaType } from "mongoose";

const HomeStatsSchema = new Schema(
  {
    // Singleton document (one set of stats for the home page)
    key: { type: String, required: true, unique: true, default: "home-stats" },
    works: { type: Number, default: 240 },
    exhibitions: { type: Number, default: 18 },
    awards: { type: Number, default: 12 },
    experienceYears: { type: Number, default: 8 },
  },
  { timestamps: true }
);

export type HomeStatsDoc = InferSchemaType<typeof HomeStatsSchema> & {
  _id: mongoose.Types.ObjectId;
};

export default mongoose.models.HomeStats ??
  mongoose.model("HomeStats", HomeStatsSchema);

