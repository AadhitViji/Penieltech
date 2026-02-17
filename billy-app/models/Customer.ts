import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  discountPercent: number;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    discountPercent: { type: Number, required: true, min: 0, max: 100 },
  },
  {
    timestamps: true,
  }
);

export const Customer: Model<ICustomer> =
  mongoose.models.Customer ||
  mongoose.model<ICustomer>("Customer", CustomerSchema);
