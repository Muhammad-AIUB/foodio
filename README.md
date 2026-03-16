# 🍔 Foodio - Full-Stack Restaurant Ordering System

Foodio is a robust, highly optimized, and fully functional restaurant ordering platform. It features seamless user authentication, dynamic menu browsing, persistent cart management, real-time order tracking, and a comprehensive Admin Dashboard for managing restaurant operations.

---

## 🚀 Tech Stack
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Zustand, Framer Motion
- **Backend:** NestJS, TypeScript, PostgreSQL, Prisma ORM
- **Authentication:** JWT (JSON Web Tokens) & bcrypt

---

## 🏗️ System Architecture & Engineering Decisions

To balance **"a seamless plug-and-play testing experience for reviewers"** with **"production-grade scalability"**, I made specific architectural trade-offs. 

### ✅ 1. Implemented Optimizations (Code-Level)
These features are live in the codebase to ensure security, high performance, and great UX:

**External Image Hosting (ImgBB CDN):** To keep the NestJS backend lightweight and ensure lightning-fast image delivery, I integrated the ImgBB API for image uploads. This offloads static asset storage from the server/database, drastically reducing bandwidth and improving frontend perceived performance.

* **In-Memory Caching (Zero-Dependency):** Implemented NestJS built-in In-Memory Cache on highly accessed public endpoints (`GET /menu-items`, `GET /categories`) to increase throughput. *(Note: I used In-Memory caching instead of Redis so reviewers can run this project instantly without needing to install external cache servers like Redis/Docker).*

* **Asynchronous Order Processing:** Utilized **NestJS Event Emitter** to create an In-Memory Async Queue for order placement. This ensures a non-blocking UI where users get instant responses while DB writing happens in the background.

* **Database Indexing:** Applied strict B-Tree indexes on `menuItems(categoryId, name)` and `orders(userId)`. This prevents full table scans and ensures O(log n) lookups, keeping read latency extremely low.

* **Security & Rate Limiting (DDoS Protection):** Configured `@nestjs/throttler` globally to prevent brute-force attacks (e.g., limiting repeated hits on `POST /orders` or `POST /login`).

* **API Consistency:** Implemented a **Global Exception Filter** in NestJS to ensure the frontend always receives predictable and structured error responses (e.g., `{ success: false, message: "...", timestamp: "..." }`).

* **UX Polish (Perceived Performance):** Added **Skeleton Loaders** (Shimmer effects) on the frontend while fetching data to provide a premium, modern user experience similar to top-tier apps.

### 🔮 2. Future Production Scaling Strategy (Infrastructure-Level)
If this MVP were to scale for a massive traffic environment, the following infrastructure upgrades would be applied:
* **Message Queues:** Replace the internal Event Emitter with a robust Message Queue (e.g., **RabbitMQ / BullMQ**) to handle severe lunchtime traffic spikes without dropping requests.
* **Distributed Caching:** Swap the In-Memory cache with a **Redis Store** for distributed caching across multiple server instances.
* **Database Replication:** Implement a Read/Write split pattern (Primary DB for Orders/Writes, Replica DBs for Menu/Reads) to distribute the database load.

---

## 🎯 Key Features
* **Public Users:** Browse categories, search by name, & filter menu items dynamically without page reloads.
* **Authenticated Users:** Add items to a persistent cart, place combined orders safely, and track order status (Pending ➔ Preparing ➔ Ready ➔ Completed).
* **Admins:** Full CRUD operations for Menu Items and Categories. View the order queue and update order statuses. Includes client-side pagination for large data sets.

---

## 🛠️ Setup & Run Instructions

To make the evaluation process as smooth as possible, **I have provided a live, cloud-hosted PostgreSQL Database URL**. You do not need to install or configure a local database to run this project!

### 1. Prerequisites
- Node.js (v18 or higher)

### 2. Backend Setup (NestJS)
Open a terminal and navigate to the backend directory:
```bash
cd server
npm install


(Optional) The provided live database is already migrated and seeded with demo data. However, if you wish to reset it to a fresh state, you can run: 

npm run seed

Admin Credentials (Pre-seeded):

Email: admin@foodio.com

Password: password123

Start the backend server:

Bash
npm run start:dev
The API will be available at http://localhost:5000/api/v1

env:


PORT=5000

DATABASE_URL="postgresql://neondb_owner:npg_bn9o3AIOESJl@ep-dry-hill-a1ffd9il-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require"
JWT_SECRET="foodio_super_secret_key_2026_do_not_share"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:3000"

3. Frontend Setup (Next.js)
Open a new terminal and navigate to the frontend directory:

Bash
cd client
npm install
Create a .env.local file in the client directory:

Code snippet
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
Start the frontend development server:

Bash
npm run dev
The web app will run on http://localhost:3000
env: 
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
NEXT_PUBLIC_IMGBB_API_KEY="07bb369ec4e4ee8a9f8e80bd1461c6d7"
Built with dedication for the DeepChain Labs Assignment.