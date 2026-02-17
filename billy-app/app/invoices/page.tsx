"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Invoice {
  _id: string;
  invoiceNumber: number;
  customerName: string;
  date: string;
  discountPercent: number;
  total: number;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  async function loadInvoices() {
    const res = await fetch("/api/invoices");
    const data = await res.json();
    setInvoices(data);
  }

  useEffect(() => {
    (async () => {
      await loadInvoices();
    })();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center bg-transparent">
      <div className="w-full max-w-4xl rounded-3xl bg-white/90 p-4 sm:p-8 shadow-xl mt-4 mb-4 sm:mt-10 sm:mb-10 mx-4">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-2xl sm:text-3xl font-semibold">Invoices</h1>
          <Link
            href="/invoices/new"
            className="rounded-full bg-black px-4 sm:px-6 py-2 text-sm font-medium text-white hover:bg-slate-900 self-start sm:self-auto"
          >
            New Invoice
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-y-1 min-w-[600px]">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="px-4 py-2 rounded-l-xl bg-slate-50">Invoice #</th>
              <th className="px-4 py-2 bg-slate-50">Customer</th>
              <th className="px-4 py-2 bg-slate-50">Date</th>
              <th className="px-4 py-2 bg-slate-50">Discount</th>
              <th className="px-4 py-2 bg-slate-50">
                Total
              </th>
              <th className="px-4 py-2 rounded-r-xl bg-slate-50"></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice._id} className="bg-white hover:bg-slate-50">
                <td className="px-4 py-2 rounded-l-xl border border-slate-100">
                  #{invoice.invoiceNumber}
                </td>
                <td className="px-4 py-2 border border-slate-100">
                  {invoice.customerName}
                </td>
                <td className="px-4 py-2 border border-slate-100">
                  {invoice.date}
                </td>
                <td className="px-4 py-2 border border-slate-100">
                  {invoice.discountPercent}%
                </td>
                <td className="px-4 py-2 border border-slate-100 text-right">
                  ₹{invoice.total.toFixed(2)}
                </td>
                <td className="px-4 py-2 border border-slate-100 rounded-r-xl">
                  <Link
                    href={`/invoices/${invoice._id}`}
                    className="rounded-full border border-slate-300 px-4 py-1 text-xs font-medium hover:bg-slate-100"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-200"
                >
                  No invoices yet. Create your first one.
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
