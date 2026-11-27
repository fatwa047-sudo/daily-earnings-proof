# WorkProof

**Prove your income, even without a payslip.**

WorkProof helps informal workers in Kenya (boda boda riders, gig and delivery workers, market traders, hawkers and freelancers) record their daily earnings and expenses, then download a professional one-page income statement. They can show it to lenders, landlords, SACCOs or embassies.

> Built for a hackathon on **Legal, Regulatory & Financial Access**, supporting **SDG 8** (Decent Work and Economic Growth), **SDG 10** (Reduced Inequalities) and **SDG 16** (Peace, Justice and Strong Institutions).

🔗 **Live demo:** _add your link here_
🎥 **Demo video:** _add your link here_

---

## The problem

Millions of people earn a living without a payslip. When they apply for a loan, rent a home or apply for a visa, they are asked for proof of income they cannot provide. As a result they are rejected, pushed to expensive lenders, or locked out of formal financial services, even when they earn steadily.

## The solution

WorkProof turns everyday earnings into a document institutions can read:

1. **Log** your earnings and expenses in about 10 seconds.
2. **Review** your totals, trends and insights on a simple dashboard.
3. **Download** a one-page income statement with a unique reference code and QR code that anyone can verify.

---

## Features

| Feature | Description |
|---------|-------------|
| Quick entry | Add income or expenses in seconds, with quick-amount buttons and a "same as yesterday" shortcut |
| Dashboard | Monthly income, expenses and net income, with a 7-day chart |
| History | See, edit and delete all entries, grouped by date |
| Income statement | One-page statement for any date range, ready to print or save as PDF |
| Verification | Every statement has a reference code and QR code, and a public page where lenders can confirm it |
| Insights | Best earning day, average daily income, biggest expense, and a monthly savings goal |
| Languages | English and Kiswahili |
| Sample data | One-click demo data so the app looks full during presentations |

### What the statement contains

- Name, work type, phone number and county
- Statement period and date issued
- Total income, total expenses and net income
- Average monthly income and number of days worked
- Month-by-month breakdown table
- Unique reference code and QR code

---

## Who it is for

- Boda boda and delivery riders
- Market traders and hawkers
- Freelancers and casual workers
- Anyone whose income is real but undocumented

The app is designed mobile-first for low-cost Android phones, with large buttons, short text and a fast entry flow.

---

## Tech stack

- **Frontend:** React and Tailwind CSS (generated with [Lovable](https://lovable.dev))
- **Backend:** Supabase (authentication and PostgreSQL database)
- **PDF output:** browser print-to-PDF layout
- **QR codes:** generated in the app for statement verification

---

## Getting started

### Option 1: Use the live app

Open the demo link above, create an account and tap **Load sample data** to explore.

### Option 2: Run it locally

Prerequisites: [Node.js](https://nodejs.org) 18 or newer, and a free [Supabase](https://supabase.com) project.

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd workproof

# 2. Install dependencies
npm install

# 3. Add your Supabase keys
cp .env.example .env
# then edit .env and fill in the values below

# 4. Start the app
npm run dev
```

Environment variables:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

---

## Data and privacy

- Each user can only see and edit their own entries (enforced with Supabase row-level security).
- The public verification page shows only the name, period and totals of a statement that was issued through WorkProof.
- No bank or mobile money access is required.
- Users can delete their entries at any time.

---

## Limitations

- Income is **self-reported**. The verification page confirms that a statement was issued by WorkProof and its contents were not altered. It does not prove that the earnings happened.
- It does not replace official tax records or audited accounts.
- Individual institutions decide whether to accept the statement.

---

## Roadmap

- [ ] Import M-Pesa statements to back up self-reported income
- [ ] SMS or USSD entry for phones without data
- [ ] Offline mode that syncs when the connection returns
- [ ] Partnerships with SACCOs and microfinance lenders to accept WorkProof statements
- [ ] Reminders to log earnings at the end of each day
- [ ] More languages

---

## How it supports the SDGs

- **SDG 8, Decent Work and Economic Growth:** gives informal workers a way to be recognised, build a financial record and reach credit that supports their businesses.
- **SDG 10, Reduced Inequalities:** reduces the gap between people with payslips and people without them.
- **SDG 16, Strong Institutions:** a verifiable, transparent record helps lenders and institutions make fairer decisions.

---

## Project structure

_Update this once your code is exported from Lovable._

```
workproof/
├── src/
│   ├── pages/        # Landing, Dashboard, Add entry, History, Statement, Verify
│   ├── components/   # Reusable UI pieces
│   ├── lib/          # Supabase client and helpers
│   └── i18n/         # English and Kiswahili text
├── public/
├── .env.example
└── README.md
```

---

## Team

_Add your name and role here._

## Acknowledgements

Built with Lovable and Supabase. Thanks to the informal workers whose daily hustle inspired this project.

## Licence

_Choose a licence (for example MIT) and add it here._
