# Payar 💰

**Simple Cash Flow Management for African SMEs & Freelancers**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Base-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

**Payar** (from the Hausa word for money, "Kudi") is a lightweight, mobile-first web application that helps small business owners and freelancers in Africa track their income and expenses, visualize their cash flow, and make better financial decisions—without the complexity of traditional accounting software.

**Live Demo:** [https://payar.vercel.app](https://payar.vercel.app) (Note: Link is a placeholder)

---

## ✨ Features (MVP v1.0)

-   **Dashboard Overview:** Get an instant snapshot of your current balance, total income, and total expenses for the month.
-   **Track Transactions:** Easily record both income and expenses with a simple, intuitive form.
-   **Smart Categorization:** Pre-defined categories tailored for local business needs (Transport, Airtime/Data, Generator Fuel, etc.).
-   **Transaction History:** View a clean, sortable list of all your financial activities.
-   **Data Privacy & Security:** Your data is yours alone. Built with robust Row Level Security (RLS) to ensure complete privacy.
-   **Responsive Design:** Works perfectly on your desktop, tablet, or mobile phone.

## 🚀 Upcoming Features

-   **📊 Advanced Reports:** Generate Profit & Loss statements over custom date ranges.
-   **👥 Multi-User Access:** Invite your accountant or business partner to view records.
-   **📷 Receipt Upload:** Attach photos of receipts to your transactions.
-   **💳 Pro Subscription:** Unlock unlimited transactions, data exports, and more.

## 🛠️ Tech Stack

-   **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
-   **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **Deployment:** [Vercel](https://vercel.com)

## 📦 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v18 or higher)
-   npm, yarn, or pnpm
-   A Supabase account

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/payar.git
    cd payar
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Environment Variables:**
    Duplicate the `.env.example` file and rename it to `.env.local`. Then, fill in your Supabase project credentials.

    ```bash
    # .env.local
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Database Setup:**
    - Navigate to the SQL Editor in your Supabase dashboard.
    - Run the SQL commands located in `/lib/schema.sql` to create the necessary tables and enable Row Level Security (RLS).

5.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

6.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🗄️ Database Schema

The application uses two main tables:

1.  `profiles`: Extends the Supabase Auth `users` table with additional user information.
2.  `transactions`: Stores all income and expense entries, linked to a user via a foreign key.

Row Level Security (RLS) policies are rigorously applied to ensure users can only access their own data.

## 🤝 Contributing

We love contributions! Whether you're fixing a bug, improving the docs, or suggesting a new feature, your help is welcome.

1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

Please read `CONTRIBUTING.md` for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   Inspired by the resilience and innovation of African SMEs and entrepreneurs.
-   Built with amazing open-source tools like Next.js, Supabase, and Tailwind CSS.
-   Icons from [Lucide](https://lucide.dev/).

## 📞 Contact & Support

-   **Email:** support@payar.ng
-   **Twitter:** [@getpayar](https://twitter.com/getpayar) (Placeholder)
-   **Issues:** If you find a bug, please open an issue on [GitHub](https://github.com/your-username/payar/issues).

---

**Made with ❤️ for Africa's business ecosystem.**