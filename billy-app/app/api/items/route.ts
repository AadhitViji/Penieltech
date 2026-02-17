import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Item } from "@/models/Item";

export async function GET() {
  await connectToDatabase();
  const items = await Item.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const { name, price } = await request.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Item name is required" }, { status: 400 });
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return NextResponse.json({ error: "Price must be a non-negative number" }, { status: 400 });
    }

    await connectToDatabase();

    const item = await Item.create({ name, price: numericPrice });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating item", error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}
