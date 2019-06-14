import { model, Schema } from 'mongoose';

const memberSchema = new Schema(
  {
    userId: { type: String, required: true },
    role: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const clubMemberSchema = new Schema({
  clubId: { type: String, required: true, index: true },
  members: { type: [memberSchema], required: true },
});

export default model('ClubMember', clubMemberSchema);
