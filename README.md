# 🔍 Mini Full-Stack Search & Scraper (Next.js + Node.js)

A compact full-stack project built with **Next.js (App Router)** and **Node.js API routes**, demonstrating a clean separation of frontend and backend logic.
This repository includes **two self-contained tasks**: a local search interface and a lightweight web scraper.

---

## ✨ Features

* ✅ **Mini Search UI** – search a local JSON dataset with relevance scoring
* ✅ **Micro Scraper** – scrape page title, meta description, and first `<h1>` from any webpage
* ✅ Clean **frontend + backend integration** in a single Next.js project
* ✅ **TypeScript** for static typing and reliability
* ✅ **Puppeteer** for headless scraping

---

## 🛠️ Tech Stack

| Component    | Technology                    |
| ------------ | ----------------------------- |
| Frontend     | Next.js 14 (App Router)       |
| Backend      | Node.js API routes            |
| Language     | TypeScript                    |
| Web Scraping | Puppeteer (headless Chrome)   |
| Data Storage | Local JSON (`data/faqs.json`) |

---

## 📁 Project Structure

```
mini-fullstack-search/
├── app/
│   ├── page.tsx               # Frontend search page
│   ├── api/
│   │   ├── search/route.ts    # POST /api/search
│   │   └── scrape/route.ts    # GET /api/scrape
│   └── components/            # Reusable UI components
├── data/
│   └── faqs.json              # Local dataset for search
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/mini-fullstack-search.git
cd mini-fullstack-search
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build & Run in Production

```bash
npm run build
npm start
```

Both frontend and API routes are served from the same Next.js app.

---

## 📝 Task A: Mini Search UI

### API Endpoint

**POST** `/api/search`

**Request Body:**

```json
{
  "query": "trust badges"
}
```

**Example Response:**

```json
{
  "results": [
    {
      "id": "1",
      "title": "Trust badges near CTA",
      "snippet": "Adding trust badges near the primary CTA increased signups by 12%."
    }
  ],
  "sources": ["1"],
  "summary": "Trust badges near the CTA improved signups and user confidence."
}
```

### Behavior

* Case-insensitive keyword match against `title` and `body`
* Returns **top 3 results**, ordered by relevance
* Includes `sources` array and combined `summary`

### Error Handling

| Case        | Status | Response                                            |
| ----------- | ------ | --------------------------------------------------- |
| Empty query | 400    | `{ "error": "Query cannot be empty." }`             |
| No matches  | 200    | `{ "results": [], "message": "No matches found." }` |

---

## 📝 Task B: Micro Scraper

### API Endpoint

**GET** `/api/scrape?url=<page-url>`

**Example:**

```
GET /api/scrape?url=https://example.com
```

**Example Response:**

```json
{
  "title": "Example Domain",
  "metaDescription": "This domain is for use in illustrative examples in documents.",
  "h1": "Example Domain",
  "status": 200
}
```

### Behavior

* Headless scraping with Puppeteer
* Waits until document is fully loaded (network idle)
* 20-second timeout per request

### Error Handling

| Case                | Status | Response                               |
| ------------------- | ------ | -------------------------------------- |
| Invalid/missing URL | 400    | `{ "error": "Invalid URL" }`           |
| Timeout             | 504    | `{ "error": "Timeout" }`               |
| General error       | 500    | `{ "error": "Internal server error" }` |

### Bonus Features

* Single retry on failed navigation
* Supports user-agent override

---

## 🏗️ Architecture Notes

* **Controller-Service-Utility separation** for clarity and maintainability:

```
/app/api/search/
├── route.ts         # Controller (handles request/response)
├── searchService.ts # Core search logic
└── utils.ts         # Helpers and scoring logic
```

* Easy to extract backend into a standalone Express service if needed

---

## 🖥️ Frontend Behavior

* Simple search input + submit button
* Loading and empty states handled gracefully
* Displays top 3 matched results (title + snippet)
* Minimal frontend: only React & built-in Next.js features

---

## 📌 Assumptions

* No external database required
* Data stored locally (`/data/faqs.json`)
* Puppeteer runs headless (no GUI required)
* Synchronous, minimal logic for clarity

---

## ⚖️ License

MIT License © 2025

---

## 📝 Notes

This project demonstrates:

* Clear API design
* Separation of concerns (frontend vs backend vs services)
* Practical Next.js usage for full-stack tasks
* Readability, maintainability, and correctness
