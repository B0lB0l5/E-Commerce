import { model, Schema } from "mongoose";
//Schema
const brandSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: true
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    logo: {
      secure_url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    createdby: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
  },
  { timestamps: true, versionKey: false }
);
//Model
export const Brand = model("Brand", brandSchema);
