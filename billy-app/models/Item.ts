import mongoose, { Schema, Document, Model } from "mongoose";

export interface IItem extends Document {
  name: string;
  price: number;
}

const ItemSchema = new Schema<IItem>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: true,
  }
);

export const Item: Model<IItem> =
  mongoose.models.Item || mongoose.model<IItem>("Item", ItemSchema);
