import mongoose, { Schema, type InferSchemaType } from "mongoose";

const TimelineItemSchema = new Schema(
  {
    year: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    tag: { type: String, default: "" },
  },
  { _id: false }
);

const AboutSchema = new Schema(
  {
    // Singleton document (one About page)
    key: { type: String, required: true, unique: true, default: "about" },

    heroTitle: { type: String, default: "A life in lines" },
    heroItalicWord: { type: String, default: "lines" },
    bioP1: { type: String, default: "" },
    bioP2: { type: String, default: "" },
    portraitImageUrl: { type: String, default: "" },
    quote: { type: String, default: "" },
    quoteLabel: { type: String, default: "Artist" },

    silenceTitle: { type: String, default: "The beauty of silence." },
    silenceText: { type: String, default: "" },
    silenceImageUrl: { type: String, default: "" },

    timelineEyebrow: { type: String, default: "The narrative arc" },
    timelineTitle: { type: String, default: "Exhibitions & milestones" },
    timeline: { type: [TimelineItemSchema], default: [] },
  },
  { timestamps: true }
);

// `key` already has `unique: true` in schema definition.

export type AboutDoc = InferSchemaType<typeof AboutSchema> & {
  _id: mongoose.Types.ObjectId;
};

export default mongoose.models.About ?? mongoose.model("About", AboutSchema);

