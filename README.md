Mini Full-Stack Search & Scraper (Next.js + Node)

This repository contains two small, self-contained tasks built using Next.js (with the App Router) and Node.js API routes.
Both tasks are implemented within a single Next.js project so that the frontend and backend run together, keeping setup minimal.

Overview
Task A – Mini Search UI

A small search interface that allows a user to enter a query and retrieve the most relevant results from a local JSON file through a backend API.

Task B – Micro Scraper

A lightweight API endpoint that scrapes a given webpage and extracts basic information like the page title, meta description, and first <h1> element.

Tech Stack

Next.js 14 (App Router) – for both frontend and backend routes

Node.js (API routes) – backend logic using the built-in Next.js server

TypeScript – static typing for clarity and safety

Puppeteer – used in Task B for web scraping

Local JSON file – used as data storage for the search feature

Project Structure
.
├── app/
│   ├── page.tsx               # Frontend search UI
│   ├── api/
│   │   ├── search/route.ts    # POST /api/search
│   │   └── scrape/route.ts    # GET /api/scrape
│   └── components/            # UI components
│
├── data/
│   └── faqs.json              # Local dataset for the search API
│
├── package.json
├── tsconfig.json
├── .env.example
└── README.md

Getting Started

Clone the repository:

git clone https://github.com/<your-username>/mini-fullstack-search.git
cd mini-fullstack-search


Install dependencies:

npm install


Run the development server:

npm run dev


Open http://localhost:3000
 in your browser.

Task A: Mini Search UI
API

POST /api/search

Request body:
{
  "query": "trust badges"
}

Example response:
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

Behavior

Performs a simple keyword match (case-insensitive) against both the title and body.

Returns up to 3 top results, ordered by relevance.

Generates a short combined summary of the matched results.

Includes a sources array for reference.

Error handling
Case	Status	Response
Empty query	400	{ "error": "Query cannot be empty." }
No matches	200	{ "results": [], "message": "No matches found." }
Task B: Micro Scraper
API

GET /api/scrape?url=<page-url>

Example:
GET /api/scrape?url=https://example.com

Example response:
{
  "title": "Example Domain",
  "metaDescription": "This domain is for use in illustrative examples in documents.",
  "h1": "Example Domain",
  "status": 200
}

Behavior

Uses Puppeteer in headless mode.

Waits until the document is fully loaded or network is idle.

Includes a 20-second timeout for every request.

Error handling
Case	Status	Response
Invalid or missing URL	400	{ "error": "Invalid URL" }
Timeout	504	{ "error": "Timeout" }
General error	500	{ "error": "Internal server error" }
Bonus

Adds a single retry on failed navigation.

Supports user-agent override.

Architecture Notes

Even though this is a single Next.js project, the backend logic is separated into controller, service, and utility layers for clarity.
For example:

/app/api/search/
  ├── route.ts         # Controller (handles request/response)
  ├── searchService.ts # Service (search logic)
  └── utils.ts         # Helpers and scoring logic


This structure makes it easy to extract into a standalone Express service if needed later.

Frontend Behavior

The main page provides:

A search input and button

Loading and empty states

List of top 3 matched results (title + short snippet)

No client-side framework beyond React and built-in Next features is used.

Running in Production

Build and start:

npm run build
npm start


The same app will serve both frontend and API routes.

Assumptions

No external database or third-party API required.

Data is stored locally in /data/faqs.json.

Puppeteer runs headless (no system GUI needed).

All logic is synchronous and intentionally minimal for clarity.

License

MIT License © 2025

Notes

This project was designed to demonstrate clear API design, clean separation of logic, and practical Next.js usage for full-stack tasks.
It avoids unnecessary complexity and focuses on correctness, readability, and maintainability.