import { model, Schema } from 'mongoose';

const memberSchema = new Schema(
  {
    bio: { type: String },
    name: { type: String },
    photoUrl: { type: String },
    readingSpeed: { type: String },
  },
  {
    timestamps: true
  }
)

const shelfSchema = new Schema(
  {
    goodReadsId: { type: String },
    isbn: { type: String },
    readingState: { type: String, required: true },
    startedReading: { type: Date },
    finishedReading: { type: Date },
    title: { type: String, required: true },
    author: { type: String },
    publishedDate: { type: Date },
    coverImageURL: { type: String },
    genres: { type: [String] }
  },
  {
    timestamps: true
  }
)

const clubSchema = new Schema(
  {
    name: { type: String, required: true },
    bio: { type: String },
    maxMembers: { type: Number, required: true },
    vibe: { type: String },
    readingSpeed: { type: String },
    shelf: {type: [shelfSchema]}
  },
  {
    timestamps: true
  }
)

export default model("Club", clubSchema);
