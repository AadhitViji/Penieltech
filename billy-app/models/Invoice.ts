import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInvoiceItem {
  itemId?: mongoose.Types.ObjectId;
  itemName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface IInvoice extends Document {
  invoiceNumber: number;
  customerId: mongoose.Types.ObjectId;
  customerName: string;
  date: string; // ISO date string
  discountPercent: number;
  subtotal: number;
  total: number;
  items: IInvoiceItem[];
}

const InvoiceItemSchema = new Schema<IInvoiceItem>(
  {
    itemId: { type: Schema.Types.ObjectId, ref: "Item" },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: Number, required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    customerName: { type: String, required: true },
    date: { type: String, required: true },
    discountPercent: { type: Number, required: true, min: 0, max: 100 },
    subtotal: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    items: { type: [InvoiceItemSchema], required: true },
  },
  {
    timestamps: true,
  }
);

export const Invoice: Model<IInvoice> =
  mongoose.models.Invoice ||
  mongoose.model<IInvoice>("Invoice", InvoiceSchema);
