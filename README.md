# PocketWise | Advanced Financial Calculator & Planner

PocketWise is a premium, responsive personal finance planning dashboard built with React, Vite, TypeScript, and Express. It features high-fidelity calculations, interactive visualization charts, and custom glassmorphism design tokens supporting both Light and Dark modes.

[![Deploy to Render](https://render.com/images/deploy-to-render.svg)](https://render.com/deploy?repo=https://github.com/Gauravverma1/financial-calculator)

---

## 🚀 Key Features

*   **Loan EMI Calculator:** Estimate monthly loan payments, calculate total interest, and view an interactive, collapsible yearly Amortization Table.
*   **SIP & Compounding Calculator:** Plan Systematic Investment Plan (SIP) or Lumpsum returns. Features Pie and Area charts showing wealth growth.
*   **Savings Planner:** Model long-term growth with compound frequency calculations (Daily, Monthly, Quarterly, Annually).
*   **Inflation & Power Adjuster:** Visualizes how living costs swell or cash savings lose purchasing power over time.
*   **Budget & Progress Manager:** Tracks itemized income/expenses, featuring utilization indicators alerting you if costs exceed earnings.
*   **Premium Glassmorphism UI:** Features Light/Dark modes, Google Font *Outfit*, and responsive layouts.

---

## 🛠️ Tech Stack
*   **Frontend:** React, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons, Shadcn UI
*   **Backend:** Express, Node.js, SQLite3 (database with persistent disk support)

---

## 💻 Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Gauravverma1/financial-calculator.git
    cd financial-calculator
    ```

2.  **Install all dependencies:**
    ```bash
    npm run install:all
    ```

3.  **Run Development Servers:**
    *   **Backend:** `npm --prefix backend start` (runs on `http://localhost:5000`)
    *   **Frontend:** `npm --prefix pocket-wise-decisions-main run dev` (runs on `http://localhost:8081`)

---

## ☁️ Deployment

### 1. Deploy to Render (One-Click)
Simply click the badge below, sign in to Render, and click **Create Resources**. Render will automatically provision a Node web server, build the frontend, and attach a persistent database disk:

[![Deploy to Render](https://render.com/images/deploy-to-render.svg)](https://render.com/deploy?repo=https://github.com/Gauravverma1/financial-calculator)

### 2. Deploy to Vercel
Deploy as a single unified monorepo:
1. Connect your repository to Vercel.
2. Vercel will automatically read [vercel.json](vercel.json) to deploy the frontend assets and backend serverless endpoints.
