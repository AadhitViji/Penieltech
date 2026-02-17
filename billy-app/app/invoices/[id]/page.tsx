"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface InvoiceItem {
  itemName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface Invoice {
  _id: string;
  invoiceNumber: number;
  customerName: string;
  date: string;
  discountPercent: number;
  subtotal: number;
  total: number;
  items: InvoiceItem[];
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (!id) return;

    async function loadInvoice() {
      const res = await fetch(`/api/invoices/${id}`);
      const data = await res.json();
      setInvoice(data);
    }

    void loadInvoice();
  }, [id]);

  function handlePrint() {
    window.print();
  }

  if (!invoice) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-900">
        <div className="rounded-3xl bg-white/90 px-10 py-8 text-sm text-slate-700 shadow-xl">
          Loading invoice...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-900">
      <div className="w-full max-w-4xl rounded-3xl bg-white p-8 shadow-xl mt-10 mb-10 print:shadow-none print:mt-0 print:mb-0">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <button
            type="button"
            className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-medium hover:bg-slate-100"
          >
            <Link href="/invoices">Back to invoices</Link>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="rounded-full bg-black px-6 py-2 text-sm font-medium text-white hover:bg-slate-900"
          >
            Print PDF
          </button>
        </div>

        <div className="mb-6 flex items-baseline justify-between">
          <div>
            <div className="text-xs font-semibold tracking-[0.2em] text-slate-500">
              INVOICE
            </div>
            <div className="text-2xl font-semibold mt-1">
              #{invoice.invoiceNumber}
            </div>
            <div className="mt-1 text-sm text-slate-500">Date: {invoice.date}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold tracking-[0.2em] text-slate-500">
              BILL TO
            </div>
            <div className="mt-1 text-base font-medium">{invoice.customerName}</div>
            <div className="text-sm text-slate-500">
              Discount: {invoice.discountPercent}%
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3 w-20">Qty</th>
                <th className="px-4 py-3 w-32">Price</th>
                <th className="px-4 py-3 w-32 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-t border-slate-100">
                  <td className="px-4 py-3">{item.itemName}</td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">₹{item.unitPrice.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">
                    ₹{item.lineTotal.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-64 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>₹{invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="mt-1 flex justify-between text-slate-600">
              <span>Discount</span>
              <span>{invoice.discountPercent}%</span>
            </div>
            <div className="mt-3 flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>₹{invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
