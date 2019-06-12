import { model, Schema } from 'mongoose';

const userSchema = new Schema(
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

export default model("User", userSchema);
