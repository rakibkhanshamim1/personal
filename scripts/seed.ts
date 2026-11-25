/**
 * Seed script — creates admin user and rich demo content.
 * Run: npx tsx scripts/seed.ts
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const envPath = resolve(import.meta.dirname ?? ".", "..", ".env");
try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim();
  }
} catch {}

const MONGODB_URI = process.env.MONGODB_URI!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme123";

const img = (id: number, w = 800, h = 450) => `https://picsum.photos/id/${id}/${w}/${h}`;
const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000);

async function seed() {
  if (!MONGODB_URI) { console.error("MONGODB_URI is required"); process.exit(1); }
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");
  const db = mongoose.connection.db!;

  // Drop all collections for a clean slate
  const collections = await db.listCollections().toArray();
  for (const col of collections) {
    await db.dropCollection(col.name);
  }
  console.log("Cleared existing data");

  // Admin
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await db.collection("admins").insertOne({
    name: "Md Shamim Mia", email: ADMIN_EMAIL, passwordHash: hash, role: "owner",
    avatar: img(64, 200, 200), failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: null,
    createdAt: now, updatedAt: now,
  });
  console.log(`Admin created: ${ADMIN_EMAIL}`);

  // Categories
  const catDocs = [
    { name: "Web Development", slug: "web-development", kind: "project", color: "#06B6D4", description: "Full-stack web applications and platforms", order: 0 },
    { name: "Frontend", slug: "frontend", kind: "project", color: "#8B5CF6", description: "UI-focused frontend projects", order: 1 },
    { name: "Backend", slug: "backend", kind: "project", color: "#F59E0B", description: "Backend services, APIs and infrastructure", order: 2 },
    { name: "Mobile", slug: "mobile", kind: "project", color: "#EC4899", description: "Mobile and cross-platform apps", order: 3 },
    { name: "JavaScript", slug: "javascript", kind: "blog", color: "#EAB308", description: "Core JavaScript tutorials and tips", order: 0 },
    { name: "React", slug: "react", kind: "blog", color: "#61DAFB", description: "React ecosystem tutorials", order: 1 },
    { name: "Next.js", slug: "nextjs", kind: "blog", color: "#000000", description: "Next.js guides and patterns", order: 2 },
    { name: "DevOps", slug: "devops", kind: "blog", color: "#10B981", description: "Deployment, CI/CD and infrastructure", order: 3 },
    { name: "Tutorials", slug: "tutorials", kind: "video", color: "#06B6D4", description: "Step-by-step video tutorials", order: 0 },
    { name: "Live Coding", slug: "live-coding", kind: "video", color: "#F59E0B", description: "Live coding sessions", order: 1 },
  ];
  await db.collection("categories").insertMany(catDocs.map((c) => ({ ...c, createdAt: now, updatedAt: now })));
  console.log("Categories seeded");

  // Tags
  const tagNames = ["React", "Next.js", "TypeScript", "Node.js", "MongoDB", "Tailwind CSS", "JavaScript", "Express", "REST API", "GraphQL", "Docker", "Redis", "PostgreSQL", "Prisma", "Zustand"];
  await db.collection("tags").insertMany(tagNames.map((name, i) => ({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), order: i, createdAt: now, updatedAt: now })));
  console.log("Tags seeded");

  const allCats = await db.collection("categories").find({}).toArray();
  const allTags = await db.collection("tags").find({}).toArray();
  const cat = (s: string) => allCats.find((c) => c.slug === s)?._id;
  const tag = (s: string) => allTags.find((t) => t.slug === s)?._id;

  // ─── Projects ───
  await db.collection("projects").insertMany([
    {
      title: "ShopWave — E-Commerce Platform",
      slug: "shopwave-ecommerce-platform",
      summary: "A modern full-stack e-commerce platform with real-time inventory, Stripe checkout, and an admin dashboard for managing products, orders, and customers.",
      description: `<h2>Overview</h2><p>ShopWave is a production-grade e-commerce platform built from the ground up with <strong>Next.js 14</strong>, <strong>TypeScript</strong>, and <strong>MongoDB</strong>. It features a beautiful storefront with lightning-fast page loads, real-time inventory tracking, and a comprehensive admin panel.</p><h2>Key Features</h2><ul><li><strong>Product Catalog</strong> — Searchable, filterable product grid with categories, variants, and image galleries</li><li><strong>Shopping Cart & Checkout</strong> — Persistent cart with Stripe payment integration, order confirmation emails</li><li><strong>User Accounts</strong> — Registration, login, order history, wishlists, and address management</li><li><strong>Admin Dashboard</strong> — Full CRUD for products, orders, customers with analytics charts</li><li><strong>Real-time Inventory</strong> — Stock levels update instantly across all sessions via WebSocket</li></ul><h2>Technical Highlights</h2><p>The app uses <strong>React Server Components</strong> for optimal performance, achieving a Lighthouse score of 98. Database queries are optimized with compound indexes and aggregation pipelines. The image pipeline uses Cloudinary for automatic resizing and WebP conversion.</p><blockquote><p>"The goal was to build something that feels as polished as Shopify but gives you full control over the codebase."</p></blockquote>`,
      coverImage: img(3, 1200, 630),
      status: "published", featured: true,
      technologies: ["Next.js", "TypeScript", "MongoDB", "Stripe", "Tailwind CSS", "Redis"],
      category: cat("web-development"),
      liveUrl: "https://shopwave-demo.vercel.app", sourceUrl: "https://github.com/shamim/shopwave",
      projectStatus: "completed", seo: {}, order: 0,
      createdAt: daysAgo(60), updatedAt: daysAgo(5),
    },
    {
      title: "TaskFlow — Project Management",
      slug: "taskflow-project-management",
      summary: "A Trello-inspired project management app with real-time drag-and-drop boards, team collaboration, and activity tracking.",
      description: `<h2>Overview</h2><p>TaskFlow is a collaborative project management tool designed for small teams. It features Kanban-style boards with <strong>real-time drag-and-drop</strong>, powered by Socket.io for instant synchronization across all connected users.</p><h2>Features</h2><ul><li><strong>Kanban Boards</strong> — Create unlimited boards with customizable columns</li><li><strong>Real-time Sync</strong> — Changes appear instantly for all team members via WebSocket</li><li><strong>Task Details</strong> — Rich descriptions, checklists, file attachments, due dates, and labels</li><li><strong>Team Management</strong> — Invite members, assign roles, track who's working on what</li><li><strong>Activity Feed</strong> — Complete audit trail of all actions across the workspace</li></ul><h2>Architecture</h2><p>Built with a <strong>React</strong> frontend using Zustand for state management, and a <strong>Node.js/Express</strong> backend. The real-time layer uses Socket.io with Redis adapter for horizontal scaling. MongoDB stores all data with optimistic UI updates for a snappy feel.</p>`,
      coverImage: img(60, 1200, 630),
      status: "published", featured: true,
      technologies: ["React", "Node.js", "Socket.io", "MongoDB", "Express", "Zustand"],
      category: cat("frontend"),
      liveUrl: "https://taskflow-app.vercel.app", sourceUrl: "https://github.com/shamim/taskflow",
      projectStatus: "completed", seo: {}, order: 1,
      createdAt: daysAgo(45), updatedAt: daysAgo(10),
    },
    {
      title: "DevPulse — Developer Analytics",
      slug: "devpulse-developer-analytics",
      summary: "A GitHub-integrated analytics dashboard that visualizes your coding activity, contribution patterns, and repository health metrics.",
      description: `<h2>Overview</h2><p>DevPulse connects to your GitHub account and provides deep insights into your development workflow. It visualizes commit patterns, PR review times, code churn, and language distribution across all your repositories.</p><h2>Features</h2><ul><li><strong>Contribution Heatmap</strong> — Visual calendar showing daily coding activity</li><li><strong>Language Breakdown</strong> — Pie charts showing language distribution over time</li><li><strong>PR Analytics</strong> — Average review time, merge rate, and reviewer stats</li><li><strong>Repository Health</strong> — Issue response time, staleness score, dependency freshness</li><li><strong>Weekly Digest</strong> — Automated email reports with your key metrics</li></ul><p>The dashboard is built with <strong>Next.js</strong> and <strong>Recharts</strong>, with a Python-based data processing pipeline that runs on a schedule via GitHub Actions.</p>`,
      coverImage: img(0, 1200, 630),
      status: "published", featured: true,
      technologies: ["Next.js", "TypeScript", "Recharts", "GitHub API", "Tailwind CSS"],
      category: cat("web-development"),
      liveUrl: "https://devpulse.vercel.app", sourceUrl: "https://github.com/shamim/devpulse",
      projectStatus: "completed", seo: {}, order: 2,
      createdAt: daysAgo(30), updatedAt: daysAgo(3),
    },
    {
      title: "API Forge — REST API Boilerplate",
      slug: "api-forge-rest-api-boilerplate",
      summary: "A production-ready Node.js REST API starter with JWT auth, Zod validation, rate limiting, comprehensive error handling, and 95%+ test coverage.",
      description: `<h2>Overview</h2><p>API Forge is an opinionated Express.js boilerplate that gives you everything you need to build a production REST API in minutes, not days.</p><h2>What's Included</h2><ul><li><strong>Authentication</strong> — JWT-based auth with refresh tokens, bcrypt password hashing</li><li><strong>Validation</strong> — Request/response validation using Zod schemas</li><li><strong>Rate Limiting</strong> — Configurable per-route rate limits with Redis backend</li><li><strong>Error Handling</strong> — Centralized error handler with structured error responses</li><li><strong>Testing</strong> — Jest + Supertest setup with 95%+ coverage, CI pipeline included</li><li><strong>Documentation</strong> — Auto-generated Swagger/OpenAPI docs from Zod schemas</li></ul><h3>Quick Start</h3><p>Clone the repo, run <code>npm install</code>, copy <code>.env.example</code> to <code>.env</code>, and you're ready to build.</p>`,
      coverImage: img(26, 1200, 630),
      status: "published", featured: false,
      technologies: ["Node.js", "Express", "TypeScript", "Jest", "MongoDB", "Zod"],
      category: cat("backend"),
      liveUrl: "", sourceUrl: "https://github.com/shamim/api-forge",
      projectStatus: "completed", seo: {}, order: 3,
      createdAt: daysAgo(90), updatedAt: daysAgo(20),
    },
    {
      title: "ChatSphere — Real-time Chat",
      slug: "chatsphere-realtime-chat",
      summary: "A WhatsApp-style real-time messaging app with group chats, file sharing, read receipts, and end-to-end message delivery.",
      description: `<h2>Overview</h2><p>ChatSphere is a full-featured messaging application supporting one-on-one and group conversations. Messages are delivered in real-time with read receipts, typing indicators, and online presence.</p><h2>Features</h2><ul><li><strong>Real-time Messaging</strong> — Instant message delivery via WebSocket</li><li><strong>Group Chats</strong> — Create groups, add/remove members, admin controls</li><li><strong>File Sharing</strong> — Send images, documents, and voice notes</li><li><strong>Read Receipts</strong> — Single/double tick system like WhatsApp</li><li><strong>Search</strong> — Full-text search across all conversations</li></ul>`,
      coverImage: img(119, 1200, 630),
      status: "published", featured: false,
      technologies: ["React", "Node.js", "Socket.io", "MongoDB", "Cloudinary"],
      category: cat("web-development"),
      liveUrl: "", sourceUrl: "https://github.com/shamim/chatsphere",
      projectStatus: "completed", seo: {}, order: 4,
      createdAt: daysAgo(120), updatedAt: daysAgo(40),
    },
    {
      title: "FitTrack — Fitness Dashboard",
      slug: "fittrack-fitness-dashboard",
      summary: "A personal fitness tracking app with workout logging, progress charts, and goal setting — built as a React Native + Next.js hybrid.",
      description: `<h2>Overview</h2><p>FitTrack helps users log workouts, track progress over time, and set fitness goals. The web dashboard provides detailed analytics, while the mobile app (React Native) is optimized for quick workout logging at the gym.</p><h2>Features</h2><ul><li><strong>Workout Logger</strong> — Quick-add exercises with sets, reps, and weight</li><li><strong>Progress Charts</strong> — Line charts showing strength progression per exercise</li><li><strong>Goal Setting</strong> — Set weekly/monthly targets and track completion</li><li><strong>Body Metrics</strong> — Log weight, measurements, and body fat percentage</li></ul>`,
      coverImage: img(190, 1200, 630),
      status: "published", featured: false,
      technologies: ["React Native", "Next.js", "TypeScript", "MongoDB", "Recharts"],
      category: cat("mobile"),
      liveUrl: "", sourceUrl: "https://github.com/shamim/fittrack",
      projectStatus: "in-progress", seo: {}, order: 5,
      createdAt: daysAgo(15), updatedAt: daysAgo(1),
    },
  ]);
  console.log("Projects seeded (6)");

  // ─── Blog Posts ───
  await db.collection("blogposts").insertMany([
    {
      title: "Getting Started with Next.js App Router: A Complete Guide",
      slug: "getting-started-nextjs-app-router",
      excerpt: "Everything you need to know about the Next.js App Router — from layouts and loading states to server components and streaming.",
      content: `<p>The App Router in Next.js introduces a fundamentally new paradigm for building React applications. If you're coming from the Pages Router, some concepts will feel familiar, but there's a lot that's genuinely new.</p><h2>Why the App Router?</h2><p>The App Router brings <strong>React Server Components</strong> (RSC) to Next.js as a first-class feature. This means components render on the server by default, sending only the HTML to the client — no JavaScript bundle for static content.</p><p>The result? Faster page loads, smaller bundles, and simpler data fetching.</p><h2>File-Based Routing</h2><p>The file structure maps directly to routes:</p><ul><li><code>app/page.tsx</code> → <code>/</code></li><li><code>app/about/page.tsx</code> → <code>/about</code></li><li><code>app/blog/[slug]/page.tsx</code> → <code>/blog/:slug</code></li></ul><h2>Layouts</h2><p>Layouts are one of the most powerful features. A <code>layout.tsx</code> file wraps all pages in its directory and below. They persist across navigations, so shared UI like sidebars and headers don't re-render.</p><h2>Loading & Error States</h2><p>Drop a <code>loading.tsx</code> file next to your page and Next.js automatically wraps it in a Suspense boundary. Same idea with <code>error.tsx</code> for error boundaries.</p><h2>Data Fetching</h2><p>Forget <code>getServerSideProps</code> and <code>getStaticProps</code>. In the App Router, you fetch data directly in your components using <code>async/await</code>:</p><blockquote><p>Server Components can be async functions — just await your data and render it. No special hooks or APIs required.</p></blockquote><h2>When to Use Client Components</h2><p>Add <code>"use client"</code> at the top of a file when you need:</p><ul><li>Event handlers (onClick, onChange)</li><li>React hooks (useState, useEffect)</li><li>Browser-only APIs (localStorage, window)</li></ul><p>The key insight: <strong>start with Server Components and only opt into Client Components when you need interactivity</strong>.</p><h2>Conclusion</h2><p>The App Router is the future of Next.js. While the learning curve is real, the performance benefits and developer experience improvements make it worthwhile. Start small, migrate one route at a time, and you'll be productive in no time.</p>`,
      coverImage: img(1, 1200, 630),
      status: "published", featured: true,
      category: cat("nextjs"),
      tags: [tag("react"), tag("nextjs"), tag("typescript")].filter(Boolean),
      readingTime: 8, wordCount: 2400,
      publishedAt: daysAgo(14), seo: {},
      createdAt: daysAgo(14), updatedAt: daysAgo(14),
    },
    {
      title: "TypeScript Best Practices You Should Follow in 2024",
      slug: "typescript-best-practices-2024",
      excerpt: "Essential TypeScript patterns and practices for writing maintainable, type-safe code — from discriminated unions to branded types.",
      content: `<h2>1. Discriminated Unions Over Optional Fields</h2><p>Instead of making fields optional, use discriminated unions to model different states explicitly:</p><p>This gives you <strong>exhaustive type checking</strong> — the compiler will tell you if you forget to handle a case.</p><h2>2. Use <code>satisfies</code> for Configuration Objects</h2><p>The <code>satisfies</code> operator validates a type while preserving the specific literal types. This is perfect for config objects where you want type checking but also need the exact values.</p><h2>3. Branded Types for IDs</h2><p>Prevent accidentally passing a UserId where a PostId is expected by using branded types:</p><p>This catches bugs at compile time that would otherwise be runtime errors.</p><h2>4. Use <code>as const</code> for Immutable Data</h2><p>When defining constant arrays or objects, use <code>as const</code> to get the most specific types possible. This is especially useful for configuration values and enum-like patterns.</p><h2>5. Avoid <code>any</code> — Use <code>unknown</code> Instead</h2><p><code>unknown</code> is the type-safe counterpart of <code>any</code>. It forces you to narrow the type before using it, which prevents runtime errors.</p><h2>6. Template Literal Types</h2><p>TypeScript's template literal types let you create precise string types:</p><p>These are great for event names, CSS properties, and API route patterns.</p><h2>Conclusion</h2><p>TypeScript is at its best when you embrace the type system fully. These patterns will make your code safer and more maintainable.</p>`,
      coverImage: img(48, 1200, 630),
      status: "published", featured: true,
      category: cat("javascript"),
      tags: [tag("typescript"), tag("javascript")].filter(Boolean),
      readingTime: 10, wordCount: 2800,
      publishedAt: daysAgo(7), seo: {},
      createdAt: daysAgo(7), updatedAt: daysAgo(7),
    },
    {
      title: "Building a REST API with Express and MongoDB: The Right Way",
      slug: "building-rest-api-express-mongodb",
      excerpt: "A comprehensive guide to building production-quality REST APIs with Express.js, MongoDB, and TypeScript — covering auth, validation, error handling, and testing.",
      content: `<h2>Project Setup</h2><p>We'll build a complete REST API with <strong>Express.js</strong>, <strong>MongoDB</strong>, and <strong>TypeScript</strong>. By the end, you'll have a production-ready API with authentication, input validation, proper error handling, and tests.</p><h2>Architecture</h2><p>We'll use a layered architecture:</p><ul><li><strong>Routes</strong> — Define endpoints and wire up middleware</li><li><strong>Controllers</strong> — Handle request/response, call services</li><li><strong>Services</strong> — Business logic, talk to the database</li><li><strong>Models</strong> — Mongoose schemas and data access</li></ul><h2>Authentication</h2><p>We'll implement JWT-based authentication with access and refresh tokens. Passwords are hashed with bcrypt (cost factor 12), and tokens are stored in HTTP-only cookies.</p><h2>Input Validation</h2><p>Every request body is validated using <strong>Zod</strong> schemas before it reaches the controller. This catches malformed data early and returns clear error messages.</p><h2>Error Handling</h2><p>A centralized error handler catches all errors and returns consistent JSON responses. Custom error classes (NotFoundError, ValidationError, etc.) make it easy to throw meaningful errors from anywhere in the codebase.</p><h2>Testing</h2><p>We test at three levels:</p><ul><li><strong>Unit tests</strong> for utility functions and services</li><li><strong>Integration tests</strong> for API endpoints using Supertest</li><li><strong>Database tests</strong> using an in-memory MongoDB instance</li></ul><h2>Conclusion</h2><p>A well-structured API is a joy to work with. Take the time to set up proper error handling, validation, and testing from the start — your future self will thank you.</p>`,
      coverImage: img(24, 1200, 630),
      status: "published", featured: false,
      category: cat("javascript"),
      tags: [tag("nodejs"), tag("express"), tag("mongodb"), tag("typescript")].filter(Boolean),
      readingTime: 12, wordCount: 3200,
      publishedAt: daysAgo(21), seo: {},
      createdAt: daysAgo(21), updatedAt: daysAgo(21),
    },
    {
      title: "Mastering Tailwind CSS: From Beginner to Pro",
      slug: "mastering-tailwind-css",
      excerpt: "Learn how to build beautiful, responsive UIs with Tailwind CSS — including custom themes, component patterns, and advanced techniques.",
      content: `<h2>Why Tailwind CSS?</h2><p>Tailwind CSS is a utility-first CSS framework that lets you build custom designs without leaving your HTML. Instead of writing custom CSS, you compose designs using small, single-purpose utility classes.</p><h2>Core Concepts</h2><p>Everything in Tailwind is a utility class:</p><ul><li><code>flex items-center gap-4</code> for flexbox layouts</li><li><code>text-lg font-bold text-gray-900</code> for typography</li><li><code>rounded-xl shadow-lg p-6</code> for cards and containers</li><li><code>hover:bg-blue-600 transition-colors</code> for interactions</li></ul><h2>Responsive Design</h2><p>Tailwind uses a mobile-first breakpoint system. Prefix any utility with a breakpoint to apply it at that screen size and above: <code>sm:</code>, <code>md:</code>, <code>lg:</code>, <code>xl:</code>.</p><h2>Dark Mode</h2><p>Add the <code>dark:</code> prefix to any utility to apply it in dark mode. Combined with CSS custom properties, you can build a complete theming system.</p><h2>Custom Theme</h2><p>Tailwind v4 uses CSS-first configuration. Define your design tokens directly in CSS with <code>@theme</code> — colors, fonts, spacing, everything lives in one place.</p><h2>Component Patterns</h2><p>Extract common patterns into components (React, Vue, etc.) rather than creating CSS abstractions. This keeps your styles colocated with your markup and makes the codebase easier to maintain.</p><h2>Conclusion</h2><p>Tailwind CSS changed how I think about styling. The utility-first approach feels weird at first, but once it clicks, you'll never want to go back to writing custom CSS files.</p>`,
      coverImage: img(180, 1200, 630),
      status: "published", featured: false,
      category: cat("react"),
      tags: [tag("tailwind-css"), tag("react")].filter(Boolean),
      readingTime: 7, wordCount: 1800,
      publishedAt: daysAgo(28), seo: {},
      createdAt: daysAgo(28), updatedAt: daysAgo(28),
    },
    {
      title: "Docker for JavaScript Developers: A Practical Guide",
      slug: "docker-for-javascript-developers",
      excerpt: "Everything a JS developer needs to know about Docker — from containerizing a Node.js app to multi-stage builds and docker-compose for local development.",
      content: `<h2>Why Docker?</h2><p>"It works on my machine" — Docker eliminates this problem by packaging your application with everything it needs to run: code, runtime, libraries, and system tools.</p><h2>Your First Dockerfile</h2><p>A Dockerfile describes how to build your container image. For a Node.js app, it typically installs dependencies, copies source code, and defines the start command.</p><h2>Multi-Stage Builds</h2><p>Use multi-stage builds to keep your production image small. The first stage installs all dependencies and builds the app. The second stage copies only the production files, resulting in an image that's often 10x smaller.</p><h2>Docker Compose for Local Dev</h2><p>When your app needs MongoDB, Redis, and maybe a queue — Docker Compose lets you define all services in a single YAML file. One <code>docker compose up</code> and your entire stack is running.</p><h2>Best Practices</h2><ul><li>Use <code>.dockerignore</code> to exclude <code>node_modules</code> and <code>.git</code></li><li>Pin base image versions (e.g., <code>node:20-alpine</code>)</li><li>Run as non-root user inside the container</li><li>Use health checks for production containers</li></ul><h2>Conclusion</h2><p>Docker simplifies deployment and makes your development environment reproducible. Start with a simple Dockerfile and docker-compose.yml, and iterate from there.</p>`,
      coverImage: img(201, 1200, 630),
      status: "published", featured: false,
      category: cat("devops"),
      tags: [tag("docker"), tag("nodejs")].filter(Boolean),
      readingTime: 9, wordCount: 2200,
      publishedAt: daysAgo(35), seo: {},
      createdAt: daysAgo(35), updatedAt: daysAgo(35),
    },
    {
      title: "React State Management in 2024: Zustand vs Redux vs Context",
      slug: "react-state-management-2024",
      excerpt: "Comparing the most popular React state management solutions — when to use each one and why Zustand might be all you need.",
      content: `<h2>The State of State Management</h2><p>React's ecosystem has matured, and you have more options than ever for managing state. Let's compare the top three approaches and when each one shines.</p><h2>React Context</h2><p><strong>Best for:</strong> Theme, auth, locale — small, rarely-changing values.</p><p>Context is built into React and requires no extra dependencies. The catch: every component that consumes a context re-renders when any part of that context changes. For frequently updating state, this causes performance issues.</p><h2>Redux Toolkit</h2><p><strong>Best for:</strong> Large apps with complex state logic, time-travel debugging needs.</p><p>Redux Toolkit simplifies Redux dramatically with <code>createSlice</code> and RTK Query. If your app has deeply nested state updates, middleware needs, or you want DevTools with time-travel debugging, Redux is still a solid choice.</p><h2>Zustand</h2><p><strong>Best for:</strong> Most apps. Simple API, great performance, tiny bundle.</p><p>Zustand gives you a simple hook-based API with automatic render optimization. Components only re-render when the specific slice of state they use changes. The API is minimal — create a store, use it in components, done.</p><h2>My Recommendation</h2><p><strong>Start with Zustand</strong> for most projects. It's simpler than Redux, more performant than Context, and covers 90% of use cases. Reach for Redux Toolkit when you need its specific features (middleware, DevTools time-travel, large team conventions).</p>`,
      coverImage: img(160, 1200, 630),
      status: "published", featured: true,
      category: cat("react"),
      tags: [tag("react"), tag("zustand"), tag("javascript")].filter(Boolean),
      readingTime: 6, wordCount: 1600,
      publishedAt: daysAgo(3), seo: {},
      createdAt: daysAgo(3), updatedAt: daysAgo(3),
    },
  ]);
  console.log("Blog posts seeded (6)");

  // ─── Videos ───
  await db.collection("videos").insertMany([
    {
      title: "Build a Full-Stack App with Next.js 14 from Scratch",
      slug: "build-fullstack-app-nextjs-14",
      description: "In this 40-minute tutorial, we build a production-ready full-stack application from scratch using Next.js 14, MongoDB, and Tailwind CSS.",
      content: `<p>We'll cover server components, API routes, database integration, authentication, and deployment. By the end, you'll have a complete app running on Vercel.</p><h2>What You'll Learn</h2><ul><li>Setting up a Next.js 14 project with TypeScript</li><li>Connecting to MongoDB with Mongoose</li><li>Building CRUD API routes</li><li>Server-side data fetching with React Server Components</li><li>Authentication with JWT cookies</li><li>Deploying to Vercel</li></ul>`,
      status: "published", featured: true,
      videoUrl: "https://www.youtube.com/watch?v=wm5gMKuwSYk", platform: "youtube", videoId: "wm5gMKuwSYk",
      thumbnail: img(2, 1280, 720), duration: 2400,
      category: cat("tutorials"),
      tags: [tag("nextjs"), tag("mongodb"), tag("typescript")].filter(Boolean),
      publishedAt: daysAgo(10), seo: {},
      createdAt: daysAgo(10), updatedAt: daysAgo(10),
    },
    {
      title: "Tailwind CSS Tips & Tricks You Need to Know",
      slug: "tailwind-css-tips-and-tricks",
      description: "10 practical Tailwind CSS tips that will speed up your workflow and help you write cleaner utility classes.",
      content: `<p>From responsive design shortcuts to custom animations, these tips will level up your Tailwind game.</p>`,
      status: "published", featured: true,
      videoUrl: "https://www.youtube.com/watch?v=ft30zcMlFao", platform: "youtube", videoId: "ft30zcMlFao",
      thumbnail: img(180, 1280, 720), duration: 1200,
      category: cat("tutorials"),
      tags: [tag("tailwind-css"), tag("react")].filter(Boolean),
      publishedAt: daysAgo(20), seo: {},
      createdAt: daysAgo(20), updatedAt: daysAgo(20),
    },
    {
      title: "Live Coding: Building a REST API with Node.js",
      slug: "live-coding-rest-api-nodejs",
      description: "Watch me build a complete REST API from scratch using Express.js, TypeScript, and MongoDB — with live problem-solving and explanations.",
      content: `<p>This is an unedited live coding session where I build a production-quality REST API. You'll see the entire thought process, including debugging and architectural decisions.</p>`,
      status: "published", featured: false,
      videoUrl: "https://www.youtube.com/watch?v=fgTGADljAeg", platform: "youtube", videoId: "fgTGADljAeg",
      thumbnail: img(26, 1280, 720), duration: 3600,
      category: cat("live-coding"),
      tags: [tag("nodejs"), tag("express"), tag("mongodb")].filter(Boolean),
      publishedAt: daysAgo(30), seo: {},
      createdAt: daysAgo(30), updatedAt: daysAgo(30),
    },
    {
      title: "React Hooks Deep Dive: useState, useEffect and Beyond",
      slug: "react-hooks-deep-dive",
      description: "A comprehensive tutorial on React hooks — from basics to advanced patterns like custom hooks, useReducer, and performance optimization.",
      content: `<p>Understanding hooks deeply is essential for writing good React code. We'll go beyond the basics and explore patterns that will make your components cleaner and more performant.</p>`,
      status: "published", featured: false,
      videoUrl: "https://www.youtube.com/watch?v=TNhaISOUy6Q", platform: "youtube", videoId: "TNhaISOUy6Q",
      thumbnail: img(160, 1280, 720), duration: 1800,
      category: cat("tutorials"),
      tags: [tag("react"), tag("javascript")].filter(Boolean),
      publishedAt: daysAgo(45), seo: {},
      createdAt: daysAgo(45), updatedAt: daysAgo(45),
    },
  ]);
  console.log("Videos seeded (4)");

  // ─── About ───
  await db.collection("abouts").insertOne({
    key: "primary",
    name: "Md Shamim Mia",
    title: "Full-Stack JavaScript Developer",
    introduction: "I'm a passionate full-stack developer specializing in building modern, performant web applications with React, Next.js, and Node.js. I love turning complex problems into clean, elegant solutions.",
    biography: `<p>Hi! I'm Shamim, a full-stack JavaScript developer based in <strong>Bangladesh</strong>. I've spent the last 3+ years building web applications that are fast, accessible, and delightful to use.</p><p>My core stack revolves around the <strong>React/Next.js ecosystem</strong> for the frontend and <strong>Node.js with MongoDB</strong> on the backend. I'm deeply passionate about developer experience, clean architecture, and performance optimization.</p><p>When I'm not coding, I enjoy contributing to open-source projects, writing technical blog posts, and creating video tutorials to help other developers learn. I believe in building in public and sharing knowledge freely.</p><h2>What I Do</h2><ul><li><strong>Full-Stack Development</strong> — End-to-end web application development with modern JavaScript technologies</li><li><strong>API Design</strong> — RESTful and GraphQL API architecture with a focus on developer experience</li><li><strong>Performance Optimization</strong> — Lighthouse audits, Core Web Vitals, bundle analysis, and server-side rendering</li><li><strong>Technical Writing</strong> — Blog posts and documentation that make complex topics approachable</li></ul><h2>My Approach</h2><p>I believe great software comes from understanding the problem deeply before writing a single line of code. I favor simplicity over cleverness, readability over brevity, and working software over perfect abstractions.</p>`,
    profileImage: img(64, 400, 400),
    email: "hello@shamim.dev",
    phone: "",
    location: "Bangladesh",
    resumeUrl: "",
    availableForWork: true,
    interests: ["Open Source", "Web Performance", "Developer Tools", "TypeScript", "System Design", "Technical Writing"],
    highlights: [
      { label: "Years Experience", value: "3+" },
      { label: "Projects Completed", value: "25+" },
      { label: "Blog Articles", value: "30+" },
      { label: "Technologies", value: "15+" },
    ],
    socialLinks: [
      { label: "GitHub", url: "https://github.com", icon: "github" },
      { label: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
      { label: "Twitter", url: "https://twitter.com", icon: "twitter" },
      { label: "YouTube", url: "https://youtube.com", icon: "youtube" },
    ],
    createdAt: now, updatedAt: now,
  });
  console.log("About seeded");

  // ─── Experience ───
  await db.collection("experiences").insertMany([
    {
      role: "Senior Full-Stack Developer", company: "TechVista Solutions", companyUrl: "https://example.com",
      location: "Remote", employmentType: "Full-time",
      description: "Leading frontend architecture for a SaaS analytics platform serving 50K+ users. Migrated legacy React app to Next.js App Router, reducing bundle size by 40% and improving Core Web Vitals across the board.",
      technologies: ["Next.js", "TypeScript", "MongoDB", "Redis", "Tailwind CSS", "Docker"],
      startDate: new Date("2024-01-01"), endDate: null, current: true, order: 0,
      createdAt: now, updatedAt: now,
    },
    {
      role: "Full-Stack JavaScript Developer", company: "WebCraft Agency", companyUrl: "https://example.com",
      location: "Dhaka, Bangladesh", employmentType: "Full-time",
      description: "Built 15+ client websites and web applications using React and Node.js. Implemented CI/CD pipelines, mentored junior developers, and established coding standards for the team.",
      technologies: ["React", "Node.js", "Express", "MongoDB", "PostgreSQL", "AWS"],
      startDate: new Date("2022-06-01"), endDate: new Date("2023-12-31"), current: false, order: 1,
      createdAt: now, updatedAt: now,
    },
    {
      role: "Frontend Developer", company: "Freelance",
      companyUrl: "", location: "Remote", employmentType: "Self-employed",
      description: "Developed responsive web applications for small businesses and startups. Specialized in React-based SPAs with REST API integrations.",
      technologies: ["React", "JavaScript", "CSS", "Firebase", "Tailwind CSS"],
      startDate: new Date("2021-03-01"), endDate: new Date("2022-05-31"), current: false, order: 2,
      createdAt: now, updatedAt: now,
    },
  ]);
  console.log("Experience seeded (3)");

  // ─── Education ───
  await db.collection("educations").insertMany([
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "National University of Bangladesh",
      institutionUrl: "https://www.nu.ac.bd",
      location: "Bangladesh", field: "Computer Science", grade: "3.5/4.0",
      description: "Focused on software engineering, data structures, algorithms, and web technologies. Completed capstone project on real-time collaborative editing.",
      startDate: new Date("2018-01-01"), endDate: new Date("2022-12-31"), current: false, order: 0,
      createdAt: now, updatedAt: now,
    },
  ]);
  console.log("Education seeded");

  // ─── Skills ───
  const skillData = [
    { name: "JavaScript", group: "frontend", level: 95, icon: "", featured: true, order: 0 },
    { name: "TypeScript", group: "frontend", level: 92, icon: "", featured: true, order: 1 },
    { name: "React", group: "frontend", level: 93, icon: "", featured: true, order: 2 },
    { name: "Next.js", group: "frontend", level: 90, icon: "", featured: true, order: 3 },
    { name: "Tailwind CSS", group: "frontend", level: 92, icon: "", featured: true, order: 4 },
    { name: "HTML/CSS", group: "frontend", level: 95, icon: "", featured: false, order: 5 },
    { name: "Node.js", group: "backend", level: 90, icon: "", featured: true, order: 6 },
    { name: "Express", group: "backend", level: 88, icon: "", featured: true, order: 7 },
    { name: "MongoDB", group: "backend", level: 88, icon: "", featured: true, order: 8 },
    { name: "PostgreSQL", group: "backend", level: 75, icon: "", featured: false, order: 9 },
    { name: "Redis", group: "backend", level: 72, icon: "", featured: false, order: 10 },
    { name: "GraphQL", group: "backend", level: 78, icon: "", featured: false, order: 11 },
    { name: "Git & GitHub", group: "tools", level: 90, icon: "", featured: true, order: 12 },
    { name: "Docker", group: "tools", level: 75, icon: "", featured: false, order: 13 },
    { name: "VS Code", group: "tools", level: 92, icon: "", featured: false, order: 14 },
    { name: "Linux", group: "tools", level: 78, icon: "", featured: false, order: 15 },
    { name: "Figma", group: "tools", level: 70, icon: "", featured: false, order: 16 },
    { name: "CI/CD", group: "tools", level: 72, icon: "", featured: false, order: 17 },
  ];
  await db.collection("skills").insertMany(skillData.map((s) => ({ ...s, createdAt: now, updatedAt: now })));
  console.log("Skills seeded (18)");

  // ─── Contact Messages (demo) ───
  await db.collection("contactmessages").insertMany([
    { name: "Sarah Johnson", email: "sarah@example.com", subject: "Project Inquiry", message: "Hi Shamim! I saw your portfolio and I'm impressed with your work. We're looking for a full-stack developer to help us build an internal dashboard for our startup. Would you be available for a freelance project? Budget is flexible. Looking forward to hearing from you!", status: "unread", createdAt: daysAgo(2), updatedAt: daysAgo(2) },
    { name: "David Chen", email: "david@example.com", subject: "Collaboration Opportunity", message: "Hey! I'm a designer working on an open-source UI component library. I'd love to collaborate with you on the React implementation. Your blog post on component patterns was exactly the approach I had in mind. Let me know if you're interested!", status: "unread", createdAt: daysAgo(5), updatedAt: daysAgo(5) },
    { name: "Emily Rodriguez", email: "emily@example.com", subject: "Great Blog Post", message: "Just wanted to say your article on TypeScript best practices was incredibly helpful. The section on discriminated unions finally made it click for me. Keep up the great content!", status: "read", createdAt: daysAgo(10), updatedAt: daysAgo(8) },
  ]);
  console.log("Contact messages seeded (3)");

  // ─── Site Settings ───
  await db.collection("sitesettings").insertOne({
    siteTitle: "Md Shamim Mia",
    siteDescription: "Full-Stack JavaScript Developer — Building modern, performant web experiences with React, Next.js, and Node.js",
    logoText: "Shamim.",
    logoImage: "",
    favicon: "",
    defaultSeoImage: img(1, 1200, 630),
    hero: {
      badge: "Available for Work",
      greeting: "Hi there, I'm",
      headline: "Md Shamim Mia",
      subheadline: "Full-Stack JavaScript Developer",
      description: "I build fast, beautiful, and scalable web applications with React, Next.js, and Node.js. Turning ideas into production-ready products is what I do best.",
      primaryCtaLabel: "View My Work",
      primaryCtaHref: "/projects",
      secondaryCtaLabel: "Read My Blog",
      secondaryCtaHref: "/blog",
      codeCardName: "Md Shamim Mia",
      codeCardRole: "Full-Stack Developer",
      codeCardStack: "React, Next.js, Node.js",
      codeCardTechBadge: "Next.js 16 ⚡",
    },
    sections: {
      about: true, projects: true, videos: true, blog: true, skills: true, contact: true, stats: true,
    },
    stats: [
      { label: "Years Experience", value: "3+" },
      { label: "Projects Delivered", value: "25+" },
      { label: "Blog Articles", value: "30+" },
      { label: "GitHub Stars", value: "500+" },
    ],
    navLinks: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Projects", href: "/projects" },
      { label: "Blog", href: "/blog" },
      { label: "Videos", href: "/videos" },
      { label: "Contact", href: "/contact" },
    ],
    footer: {
      tagline: "Building the web, one component at a time.",
      copyright: "© 2024 Md Shamim Mia. All rights reserved.",
      links: [
        { label: "GitHub", href: "https://github.com" },
        { label: "LinkedIn", href: "https://linkedin.com" },
        { label: "Twitter", href: "https://twitter.com" },
      ],
    },
    contact: {
      email: "hello@shamim.dev",
      phone: "+880 1234 567890",
      location: "Bangladesh",
      formHeading: "Get in Touch",
      formDescription: "Have a project in mind or just want to say hello? Drop me a message and I'll get back to you within 24 hours.",
    },
    socialLinks: [
      { label: "GitHub", url: "https://github.com", icon: "github" },
      { label: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
      { label: "Twitter", url: "https://twitter.com", icon: "twitter" },
      { label: "YouTube", url: "https://youtube.com", icon: "youtube" },
    ],
    analytics: { googleAnalyticsId: "" },
    createdAt: now, updatedAt: now,
  });
  console.log("Site settings seeded");

  await mongoose.disconnect();
  console.log("\n✓ Seed complete! Login with:");
  console.log(`  Email: ${ADMIN_EMAIL}`);
  console.log(`  Password: (your ADMIN_PASSWORD env var)`);
}

seed().catch((err) => { console.error(err); process.exit(1); });
