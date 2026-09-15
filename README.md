# Learn Webiny Next.js App

A Next.js starter application for learning how to integrate Webiny Headless CMS with Static Site Generation.

## About This Project

This is the companion repository for the **Learn Webiny - Headless CMS Course**. 

By following **Lesson 8: Learn Webiny Next.js App**, you'll learn how to:
- Connect a Next.js app to Webiny Headless CMS
- Create API keys with proper permissions
- Fetch and display content using the Read API
- Implement Static Site Generation (SSG)
- Handle errors gracefully with TypeScript

## Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm
- A Webiny project with published products (from Lessons 1-7)
- Basic understanding of React and Next.js

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/webiny/learn-webiny-nextjs-app.git
cd learn-webiny-nextjs-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Follow the Lesson

This repository contains the **starter code** only. To complete the application, follow the step-by-step tutorial:

👉 **[Lesson 8: Learn Webiny Next.js App](https://webiny.com/learn/lessons/headless-cms/learn-webiny-nextjs-app)**

The lesson will guide you through:
- Finding your Webiny API URL
- Creating an API key with proper permissions
- Setting up environment variables
- Creating TypeScript types (`lib/types.ts`)
- Building the API client (`lib/webiny.ts`)
- Fetching and displaying products (`app/page.tsx`)
- Building for production with SSG

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
learn-webiny-nextjs-app/
├── app/              # Next.js App Router
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Homepage (you'll modify this)
│   └── globals.css   # Tailwind styles
├── lib/              # Your code goes here (create these files):
│   ├── types.ts      # TypeScript interfaces (you'll create)
│   └── webiny.ts     # API client functions (you'll create)
├── public/           # Static assets
├── .env.local        # API credentials (you'll create - not in git)
└── package.json      # Dependencies
```

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Webiny API details:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` to set:

```env
WEBINY_API_ENDPOINT=https://your-webiny-api-url
WEBINY_API_TOKEN=your-webiny-api-token
WEBINY_API_TENANT=root
```

These same values must also be added to GitHub repository secrets for the deployment workflow.

## Need Help?

- **📚 Full Tutorial:** [Lesson 8](https://webiny.com/learn/lessons/headless-cms/learn-webiny-nextjs-app)
- **✅ Completed Example:** Check the [`completed` branch](https://github.com/webiny/learn-webiny-nextjs-app/tree/completed) to see the full solution
- **📖 Webiny Docs:** [webiny.com/docs](https://www.webiny.com/docs)
- **💬 Community:** [Webiny Community Slack](https://www.webiny.com/slack)

## What's Next?

After completing Lesson 8, continue with:
- **Lesson 9:** Writing Data (Create a contact form with mutations)
- **Lesson 10:** Lifecycle Events (Email validation)
- **Lesson 11:** Customize Data Lists
- **Lesson 12:** Create Custom APIs

## Tech Stack

- **Next.js** 16.1.6 (App Router)
- **React** 19.2.3
- **TypeScript** 5
- **Tailwind CSS** 4
- **Webiny** Headless CMS

## License

MIT

---

**Built with ❤️ for the Webiny learning community**
