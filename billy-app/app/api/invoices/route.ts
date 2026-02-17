import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Invoice } from "@/models/Invoice";
import { Customer } from "@/models/Customer";

export async function GET() {
  await connectToDatabase();
  const invoices = await Invoice.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(invoices);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerId,
      date,
      discountPercent,
      items,
    }: {
      customerId: string;
      date: string;
      discountPercent: number;
      items: {
        itemId?: string;
        itemName: string;
        quantity: number;
        unitPrice: number;
      }[];
    } = body;

    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
      return NextResponse.json({ error: "Valid customer is required" }, { status: 400 });
    }

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    if (!items || !items.length) {
      return NextResponse.json({ error: "At least one line item is required" }, { status: 400 });
    }

    await connectToDatabase();

    const customer = await Customer.findById(customerId).lean();
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const safeItems = items.map((item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      const lineTotal = qty * price;
      return {
        itemId: item.itemId ? new mongoose.Types.ObjectId(item.itemId) : undefined,
        itemName: item.itemName,
        quantity: qty,
        unitPrice: price,
        lineTotal,
      };
    });

    const subtotal = safeItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const discount = Number(discountPercent) || 0;
    const total = subtotal * (1 - discount / 100);

    const lastInvoice = await Invoice.findOne().sort({ invoiceNumber: -1 }).lean();
    const nextNumber = (lastInvoice?.invoiceNumber ?? 0) + 1;

    const created = await Invoice.create({
      invoiceNumber: nextNumber,
      customerId: new mongoose.Types.ObjectId(customerId),
      customerName: customer.name,
      date,
      discountPercent: discount,
      subtotal,
      total,
      items: safeItems,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating invoice", error);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}
