"use client";

import { useEffect, useState } from "react";

interface Item {
  _id: string;
  name: string;
  price: number;
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadItems() {
    const res = await fetch("/api/items");
    const data = await res.json();
    setItems(data);
  }

  useEffect(() => {
    void loadItems();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price: Number(price || 0) }),
      });

      if (!res.ok) {
        console.error(await res.json());
      } else {
        setName("");
        setPrice("");
        await loadItems();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-transparent">
      <div className="w-full max-w-4xl rounded-3xl bg-white/90 p-4 sm:p-8 shadow-xl mt-4 mb-4 sm:mt-10 sm:mb-10 mx-4">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6">Items</h1>

        <form
          onSubmit={handleSubmit}
          className="mb-6 grid grid-cols-[2fr,1fr,auto] gap-2 sm:gap-4"
        >
          <input
            className="rounded-full border border-slate-300 px-3 sm:px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="rounded-full border border-slate-300 px-3 sm:px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-black px-4 sm:px-6 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Item"}
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-y-1 min-w-[500px]">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-4 py-2 rounded-l-xl bg-slate-50">Item</th>
                <th className="px-4 py-2 rounded-r-xl bg-slate-50 text-right">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="bg-white hover:bg-slate-50">
                  <td className="px-4 py-2 rounded-l-xl border border-slate-100">
                    {item.name}
                  </td>
                  <td className="px-4 py-2 rounded-r-xl border border-slate-100 text-right">
                    ₹{item.price.toFixed(2)}
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-6 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-200"
                  >
                    No items yet. Add your first one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
