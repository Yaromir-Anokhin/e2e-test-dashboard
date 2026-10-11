# 📊 E2E Test Automation Analytics Dashboard

A modern web dashboard for visualizing automated End-to-End (E2E) test results executed with **Playwright**, featuring run analytics powered by **Recharts**, failure diagnostics, code snippets, stack traces, and step-by-step logs.

---

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Dark Mode UI, Glassmorphism)
- **Testing Engine**: [Playwright Test](https://playwright.dev/) (Chromium, parallel execution, JSON reporter)
- **Data Visualization**: [Recharts](https://recharts.org/) (Pie/Donut test status chart, BarChart for test run durations)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🏛 Architecture

```text
├── app/
│   ├── api/
│   │   ├── test-results/route.ts  # Parses Playwright JSON reports and serves metrics
│   │   └── run-tests/route.ts     # Triggers test suite runs directly from the UI
│   ├── globals.css                # Tailwind styling and design tokens
│   ├── layout.tsx                 # Root layout and metadata
│   └── page.tsx                   # Client dashboard with charts, data table, and log viewer
├── e2e/
│   └── sample.spec.ts             # E2E test suites (passed + failed demo cases)
├── playwright-report/
│   └── test-results.json          # Generated Playwright JSON test report
├── types/
│   └── test-report.ts             # TypeScript interfaces for test report data
├── playwright.config.ts           # Playwright configuration (JSON reporter)
└── package.json
```

---

## 🛠️ Dashboard Capabilities

1. **Interactive KPIs**:
   - Total test count.
   - Passed tests count and Pass Rate percentage.
   - Failed tests count with visual indicators.
   - Total and individual run execution times.

2. **Recharts Visualizations**:
   - **Donut Chart**: Ratio of Passed / Failed / Skipped tests with center metrics.
   - **Bar Chart**: Execution time per test case in milliseconds.

3. **Test Table & Deep Diagnostics**:
   - Status filtering (*All*, *Passed*, *Failed*) and live search.
   - Expandable rows for failed tests displaying:
     - ANSI-stripped error messages.
     - Exact code snippet highlighting the failed assertion line.
     - Full stack trace.
     - Step-by-step test execution logs and durations.

4. **One-Click Test Execution**:
   - **"Run All Tests"** button executes `npx playwright test` via `/api/run-tests` and refreshes dashboard analytics in real-time.

---

## 📦 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Yaromir-Anokhin/e2e-test-dashboard.git
cd e2e-test-dashboard
```

### 2. Install dependencies
```bash
npm install
```

### 3. Install Playwright browser binaries
```bash
npx playwright install chromium
```

### 4. Run E2E tests to generate the initial report
```bash
npm run test:e2e
```
*(One test case is intentionally set to fail to demonstrate error diagnostic features).*

### 5. Launch the Web Dashboard
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Interactive Debugging with Playwright UI

To inspect and step through tests using Playwright's native UI runner:
```bash
npm run test:e2e:ui
```
