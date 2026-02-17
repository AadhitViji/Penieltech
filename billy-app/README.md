# Billy – Tiny Billing Demo

A functional replica of the Billy billing app built with Next.js 14, Tailwind CSS, and MongoDB Atlas. You can add items, customers with discounts, and create invoices with automatic calculations. Features a responsive UI with interactive particle animations and custom dropdowns.

## 🌐 Live Demo

[**Deployed on Vercel**](https://penieltech-ten.vercel.app/)

---

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** MongoDB Atlas (cloud-hosted)
- **ODM:** Mongoose
- **Deployment:** Vercel (serverless functions)
- **UI Components:** Custom select dropdowns, interactive background particles

---

## 📁 Project Structure

```
billy-app/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (items, customers, invoices)
│   ├── invoices/          # Invoice pages (list, new, [id])
│   ├── items/             # Items page
│   ├── customers/         # Customers page
│   ├── layout.tsx         # Root layout + navbar
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── AnimatedBackground.tsx
│   ├── CustomSelect.tsx
│   └── NavLink.tsx
├── lib/                   # Helpers (MongoDB connection)
├── models/                # Mongoose schemas
├── .env.local             # Local environment variables (DO NOT commit)
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A free MongoDB Atlas cluster with a connection string

### 1) Clone the repository

```bash
git clone <your-repo-url>
cd billy-app
```

### 2) Install dependencies

```bash
npm install
```

### 3) Set up environment variables

Create a file named `.env.local` in the project root and add:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority
```

Replace the placeholder with below values

mongodb+srv://aadhitviji7_db_user:4gnxjgSK3jQrO5IZ@billy-cluster.8nxjdwk.mongodb.net/?appName=billy-cluster

### 4) Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 Pages & Features

### Home (`/`)
- Welcome screen with app description and tech stack info.

### Items (`/items`)
- Add items with name and price.
- View list of all items.
- Prices shown in INR (₹).

### Customers (`/customers`)
- Add customers with name and discount %.
- View list of all customers.

### Invoices (`/invoices`)
- List all invoices with invoice number, customer, date, discount, and total.
- Create a new invoice (`/invoices/new`):
  - Select a customer (auto-fills discount).
  - Add line items by selecting items, quantity, and price.
  - Totals (subtotal, discount, grand total) are calculated automatically.
- View an invoice (`/invoices/[id]`):
  - Full invoice details with line items and totals.
  - Print-friendly layout.

---

## 🎨 UI Features

- **Responsive design:** Works on mobile and desktop.
- **Interactive background:** Floating particles that follow your cursor and spawn on click.
- **Custom dropdowns:** Styled select components with hover/focus states.
- **White navbar:** Clean header with logo and navigation pills.
- **Currency:** INR (₹) symbol used throughout.

---

## 📝 Notes

- The app uses MongoDB Atlas; ensure your IP is whitelisted in Atlas if you encounter connection issues.
- `.env.local` is never committed to git; add it to `.gitignore`.
- All pages are responsive; tables scroll horizontally on small screens.
- The background animation is purely visual and does not affect performance.

---


**Built with ❤️ for the Billy interview task.**
