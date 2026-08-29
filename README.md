# DSA with C — Backend REST API Service

[![License: All Rights Reserved](https://img.shields.io/badge/License-All%20Rights%20Reserved-red.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19.2-000000.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208.5.1-47A248.svg)](https://mongoosejs.com/)

This repository houses the lightweight, robust **REST API service** powering the [DSA with C](https://dsa-with-c.vercel.app) platform. It provides persistent storage and data management for student accounts, solved problem tracking, and curated algorithmic challenge datasets.

> [!NOTE]
> **Reference & Portfolio Notice**: This repository is maintained publicly for reference, architectural review, and portfolio inspection purposes. The live production deployment runs independently with separate, private credentials on cloud infrastructure.

---

## 🛠️ Tech Stack & Dependencies

* **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
* **Web Framework**: [Express.js](https://expressjs.com/) (`^4.19.2`)
* **Database & ODM**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) (`^8.5.1`)
* **Cryptography & Auth**: [bcrypt](https://github.com/kelektiv/node.bcrypt.js) (`^6.0.0`)
* **Middleware**:
  * [cors](https://www.npmjs.com/package/cors) (`^2.8.5`) — Configurable Cross-Origin Resource Sharing
  * [cookie-parser](https://www.npmjs.com/package/cookie-parser) (`^1.4.6`) — Cookie parsing utility
  * [dotenv](https://www.npmjs.com/package/dotenv) (`^16.4.5`) — Environment variable management
* **Development Utilities**:
  * [nodemon](https://nodemon.io/) (`^3.1.4`) — Hot-reloading development server

---

## 🏛️ High-Level Architecture & Modules

The backend follows a modular, layer-separated Model-Controller-Route architecture:

```
backend/
├── .env.sample           # Environment variable template with documentation
├── package.json          # Project metadata and dependencies
└── src/
    ├── app.js            # Express application setup, middlewares, and route mounting
    ├── constants.js      # Application-wide constants (e.g. database name)
    ├── index.js          # Server bootstrapper and MongoDB connection initializer
    ├── controllers/
    │   ├── problem.controller.js  # Problem dataset filtering, seeding, and management
    │   └── user.controller.js     # User registration, bcrypt authentication, and solved progress
    ├── db/
    │   └── index.js      # Mongoose connection handling and index maintenance
    ├── middlewares/
    │   └── error.middleware.js    # Centralized global error handling with environment-aware stacks
    ├── models/
    │   ├── problem.model.js       # Problem schema (category, difficulty, hints, LeetCode URLs)
    │   └── user.model.js          # User schema (username, bcrypt password hash, solved problems array)
    ├── routes/
    │   ├── problem.routes.js      # REST endpoints for problem catalog operations
    │   └── user.routes.js         # REST endpoints for user authentication & progress synchronization
    └── utils/
        ├── ApiError.js   # Standardized operational error class
        ├── ApiResponse.js# Standardized JSON response envelope
        └── asyncHandler.js# Async route wrapper for exception forwarding
```

### Module Responsibilities:

* **Users Module (`user.model.js`, `user.controller.js`, `user.routes.js`)**:
  * Manages student account registration and login authentication.
  * Ensures password privacy by salting and hashing credentials with `bcrypt` before storage.
  * Handles user statistics queries and bidirectional progress toggling (marking problems as solved/unsolved with timestamps).

* **Problems Module (`problem.model.js`, `problem.controller.js`, `problem.routes.js`)**:
  * Serves the curated collection of DSA practice questions with flexible filtering by category, difficulty level, and search terms.
  * Provides administrative utilities for bulk dataset seeding and catalog maintenance.

* **Database Connection (`db/index.js`)**:
  * Establishes resilient connections to MongoDB and automatically attaches the designated database namespace.
  * Includes automated schema index maintenance.

* **Error Handling (`error.middleware.js`)**:
  * Catches unhandled errors globally and returns predictable, structured JSON envelopes while conditionally exposing debugging stack traces in development mode only.

---

## 🚀 Local Development Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [npm](https://www.npmjs.com/) (v9 or higher)
* A running [MongoDB](https://www.mongodb.com/) instance (local or MongoDB Atlas cluster)

### Step-by-Step Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/arko252007-dot/dsa-backend.git
   cd dsa-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the sample environment file and configure your local settings:
   ```bash
   cp .env.sample .env
   ```
   Open `.env` and fill in your local or testing values (never commit live production credentials):
   ```env
   PORT=8000
   NODE_ENV=development
   MONGODB_URI="mongodb://127.0.0.1:27017"
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:8000`.

---

## 📬 Feedback & Bug Reports

Found a bug, encountered an API discrepancy, or wish to propose an improvement? Please file an issue on our central frontend repository tracker:

👉 **[Submit an Issue on GitHub](https://github.com/arko252007-dot/dsa-frontend/issues)**

*(Note: To maintain streamlined tracking across the project, all frontend and backend issues are centralized in the frontend issue tracker.)*

---

## 📄 License

This project is source-available for viewing and reference purposes only. All rights reserved — see [LICENSE](LICENSE). Reuse, modification, or redistribution is not permitted without prior written permission from the author.

