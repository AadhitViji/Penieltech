import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-transparent">
      <div className="w-full max-w-4xl rounded-3xl bg-white/90 p-4 sm:p-8 shadow-xl mt-4 mb-4 sm:mt-10 sm:mb-10 mx-4">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6">Welcome to Billy</h1>

        <p className="mb-4 sm:mb-6 text-slate-700 leading-relaxed text-sm sm:text-base">
          This demo is a tiny billing workflow. You can add items, add customers with discounts, then create invoices from those ingredients. Each invoice can be viewed and printed as a PDF.
        </p>

        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">How it works</h2>
          <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
            Start by creating a few items and customers. Then head to invoices to build a bill by selecting a customer and adding line items. Totals are calculated automatically, and the invoice detail view lets you review and print a clean copy.
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <section>
            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Items</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-1 text-sm sm:text-base">
              <li><strong>Item name:</strong> the label that appears on invoices.</li>
              <li><strong>Price:</strong> the default unit price used when the item is selected.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Customers</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-1 text-sm sm:text-base">
              <li><strong>Customer name:</strong> the person or company being billed.</li>
              <li><strong>Discount %:</strong> the default discount applied to that customer.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Invoices</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-1 text-sm sm:text-base">
              <li><strong>Invoice ID:</strong> the unique number for the invoice.</li>
              <li><strong>Customer:</strong> the selected customer for the bill.</li>
              <li><strong>Date:</strong> when the invoice was created.</li>
              <li><strong>Line items:</strong> each row has an item name, quantity, price, and line total.</li>
              <li><strong>Subtotal:</strong> sum of all line totals before discount.</li>
              <li><strong>Discount %:</strong> applied to the subtotal.</li>
              <li><strong>Total:</strong> subtotal minus discount.</li>
            </ul>
          </section>
        </div>

        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">About this implementation</h3>
          <p className="text-slate-700 leading-relaxed mb-2 sm:mb-3 text-sm sm:text-base">
            This version is a functional replica of the original Billy demo. It includes all the same user flows, data points, and behaviors, with a refreshed design and modern tech stack.
          </p>
          <ul className="list-disc list-inside text-slate-700 space-y-1 text-xs sm:text-sm">
            <li><strong>Framework:</strong> Next.js 14 (App Router) for the UI and API routes.</li>
            <li><strong>Database:</strong> MongoDB Atlas (cloud-hosted) with Mongoose for data modeling.</li>
            <li><strong>Styling:</strong> Tailwind CSS for a clean, responsive UI.</li>
            <li><strong>Deployment:</strong> Optimized for Vercel (serverless functions, environment variables).</li>
            <li><strong>Features:</strong> Items, Customers, Invoices; automatic totals; PDF-style print view.</li>
          </ul>
        </div>

        <div className="mt-6 sm:mt-8 flex justify-center">
          <Link
            href="/items"
            className="rounded-full bg-black px-6 sm:px-8 py-2 text-sm font-medium text-white hover:bg-slate-900"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
