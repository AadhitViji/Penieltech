import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";

export async function GET() {
  await connectToDatabase();
  const customers = await Customer.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(customers);
}

export async function POST(request: Request) {
  try {
    const { name, discountPercent } = await request.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Customer name is required" }, { status: 400 });
    }

    const numericDiscount = Number(discountPercent ?? 0);
    if (Number.isNaN(numericDiscount) || numericDiscount < 0 || numericDiscount > 100) {
      return NextResponse.json(
        { error: "Discount must be a number between 0 and 100" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const customer = await Customer.create({ name, discountPercent: numericDiscount });
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error("Error creating customer", error);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}
