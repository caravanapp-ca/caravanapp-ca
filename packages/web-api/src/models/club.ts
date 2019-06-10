import { model, Schema } from 'mongoose';

const clubSchema = new Schema(
  {
    name: { type: String, required: true },
    bio: { type: String },
    maxMembers: { type: Number, required: true },
  },
  {
    timestamps: true
  }
)

export default model("Club", clubSchema);
