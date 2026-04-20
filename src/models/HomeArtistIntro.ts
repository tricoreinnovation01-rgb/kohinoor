import mongoose, { Schema, type InferSchemaType } from "mongoose";

const HomeArtistIntroSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "home-artist-intro" },
    imageUrl: { type: String, default: "" },
    imageAlt: { type: String, default: "Kohinoor in the studio" },
    name: { type: String, default: "Kohinoor" },
    roleLine: { type: String, default: "Drawing artist & architectural designer" },
    eyebrow: { type: String, default: "Artist" },
    headline: { type: String, default: "A dialogue between light and void." },
    headlineEmphasis: { type: String, default: "light and void" },
    body: { type: String, default: "" },
    quote: { type: String, default: "" },
    signature: { type: String, default: "— Kohinoor" },
  },
  { timestamps: true }
);

export type HomeArtistIntroDoc = InferSchemaType<typeof HomeArtistIntroSchema> & {
  _id: mongoose.Types.ObjectId;
};

export default mongoose.models.HomeArtistIntro ??
  mongoose.model("HomeArtistIntro", HomeArtistIntroSchema);

