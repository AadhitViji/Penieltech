"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CustomSelect from "@/components/CustomSelect";

interface Item {
  _id: string;
  name: string;
  price: number;
}

interface Customer {
  _id: string;
  name: string;
  discountPercent: number;
}

interface LineItem {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
}

export default function NewInvoicePage() {
  const router = useRouter();

  const [items, setItems] = useState<Item[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [customerId, setCustomerId] = useState("");
  const [date, setDate] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [lines, setLines] = useState<LineItem[]>([
    {
      id: "1",
      itemId: "",
      itemName: "",
      quantity: 1,
      unitPrice: 0,
    },
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [itemsRes, customersRes] = await Promise.all([
        fetch("/api/items"),
        fetch("/api/customers"),
      ]);
      const [itemsData, customersData] = await Promise.all([
        itemsRes.json(),
        customersRes.json(),
      ]);
      setItems(itemsData);
      setCustomers(customersData);
    }

    void loadData();
  }, []);

  useEffect(() => {
    const customer = customers.find((c) => c._id === customerId);
    if (customer) {
      setDiscountPercent(customer.discountPercent ?? 0);
    }
  }, [customerId, customers]);

  const totals = useMemo(() => {
    const subtotal = lines.reduce(
      (sum, line) => sum + line.quantity * line.unitPrice,
      0
    );
    const discount = discountPercent || 0;
    const total = subtotal * (1 - discount / 100);
    return { subtotal, total };
  }, [lines, discountPercent]);

  function updateLine(id: string, changes: Partial<LineItem>) {
    setLines((prev) =>
      prev.map((line) => (line.id === id ? { ...line, ...changes } : line))
    );
  }

  function handleItemChange(lineId: string, itemId: string) {
    const item = items.find((i) => i._id === itemId);
    updateLine(lineId, {
      itemId,
      itemName: item?.name ?? "",
      unitPrice: item?.price ?? 0,
    });
  }

  function addRow() {
    setLines((prev) => [
      ...prev,
      {
        id: String(prev.length + 1),
        itemId: "",
        itemName: "",
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  }

  async function handleSave() {
    if (!customerId || !date) return;

    setSaving(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          date,
          discountPercent,
          items: lines
            .filter((l) => l.itemName && l.quantity > 0)
            .map((l) => ({
              itemId: l.itemId,
              itemName: l.itemName,
              quantity: l.quantity,
              unitPrice: l.unitPrice,
            })),
        }),
      });

      if (!res.ok) {
        console.error(await res.json());
        return;
      }

      const created = await res.json();
      router.push(`/invoices/${created._id}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-transparent">
      <div className="w-full max-w-4xl rounded-3xl bg-white/90 p-8 shadow-xl mt-10 mb-10">
        <h1 className="text-3xl font-semibold mb-6">Create Invoice</h1>

        <div className="mb-6 grid grid-cols-[2fr,1fr] gap-4">
          <CustomSelect
            options={customers.map((c) => ({ value: c._id, label: c.name }))}
            value={customerId}
            onChange={setCustomerId}
            placeholder="Select customer"
          />
          <input
            type="date"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3 w-20">Qty</th>
                <th className="px-4 py-3 w-32">Price</th>
                <th className="px-4 py-3 w-32 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => {
                const lineTotal = line.quantity * line.unitPrice;
                return (
                  <tr key={line.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <CustomSelect
                        options={items.map((item) => ({ value: item._id, label: item.name }))}
                        value={line.itemId}
                        onChange={(val) => handleItemChange(line.id, val)}
                        placeholder="Select item"
                        className="w-full"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min={1}
                        className="w-20 rounded-full border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={line.quantity}
                        onChange={(e) =>
                          updateLine(line.id, {
                            quantity: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        className="w-28 rounded-full border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={line.unitPrice}
                        onChange={(e) =>
                          updateLine(line.id, {
                            unitPrice: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-right text-slate-900">
                      ₹{lineTotal.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button
            type="button"
            onClick={addRow}
            className="px-4 py-3 text-xs font-medium text-emerald-700 hover:text-emerald-800"
          >
            + Add row
          </button>
        </div>

        <div className="flex flex-col items-end gap-2 mb-6">
          <div className="flex w-64 justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span className="font-medium">
              ₹{totals.subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex w-64 items-center justify-between text-sm">
            <span className="text-slate-500">Discount (%)</span>
            <input
              type="number"
              min={0}
              max={100}
              className="w-24 rounded-full border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value) || 0)}
            />
          </div>
          <div className="mt-2 flex w-64 justify-between text-sm font-semibold">
            <span className="text-slate-800">Grand Total</span>
            <span>₹{totals.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-black px-8 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Invoice"}
          </button>
        </div>
      </div>
    </div>
  );
}
