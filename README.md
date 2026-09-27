# 🤝 SkillBridge — Peer-to-Peer Skill Exchange Platform

SkillBridge is a full-stack **MERN (MongoDB, Express, React, Node.js)** platform designed to empower people to learn and teach skills through direct peer-to-peer collaboration. Whether you want to learn guitar, master web development, or improve design skills, SkillBridge connects you with partners for mutual learning—completely fee-free.

## 🌟 Core Features

* 🔑 **Secure Authentication & User Authorization**

  * JWT-based authentication with password hashing via `bcrypt`.

  * Identity state preservation across user sessions.

* 🔍 **Interactive Skill Exploration & Search**

  * Explore diverse skill categories with instant real-time search and filter controls.

  * View individual user profiles detailing skills offered vs. skills desired.

* 🤝 **Seamless Connection & Request Workflow**

  * Send swap requests directly to skill providers.

  * Dedicated **Requests Portal** to review, accept, or decline incoming swap invitations.

* 💬 **Real-Time Interactive Messaging**

  * Instant direct messaging using **Socket.io** web sockets.

  * Dedicated active conversation lists automatically filtered for confirmed connections.

* 🔔 **Instant Live Notifications**

  * In-app notification system informing users of new requests and chat messages instantly.

## 📸 Application Screenshots

> **Note:** To display your screenshots in this README, upload your images directly into a `docs/` or `assets/` folder in your repository or upload them in a GitHub issue to copy the image URL, then update the paths below.

### 1. Explore & Skill Discovery :- 

<img width="1519" height="727" alt="Explore page" src="https://github.com/user-attachments/assets/d327cacb-21ad-4307-91ee-07785466d84c" />

### 2. Login page :-

<img width="1534" height="729" alt="login page" src="https://github.com/user-attachments/assets/9fd78d07-2fce-4e33-aaf5-62d76e712c8b" />

### 3. Incoming & Accepted Swap Requests :-

<img width="1535" height="728" alt="requests page" src="https://github.com/user-attachments/assets/73face64-bbd5-46a9-baf1-66dd48d8a055" />

### 4. Real-Time Chat & Direct Messaging :-

<img width="1535" height="730" alt="chat page" src="https://github.com/user-attachments/assets/de124672-fdf9-454e-8ca5-e2585ea723af" />

### 5. Notifications page

<img width="1521" height="727" alt="Notification page" src="https://github.com/user-attachments/assets/63c671a4-7e44-4e8f-ba0d-069533a5e96b" />

## 🛠️ Tech Stack

### Frontend

* **Framework**: React.js (built with Vite)

* **Styling**: Tailwind CSS, Glassmorphic UI design

* **Icons**: Lucide React

* **HTTP Client**: Axios

* **Notifications**: React Hot Toast

### Backend

* **Runtime**: Node.js & Express.js

* **Database**: MongoDB & Mongoose ORM

* **Real-Time Engine**: Socket.io

* **Security**: JSON Web Tokens (JWT) & Cors

## 🚀 Step-by-Step Localhost Setup Guide

Follow these instructions to run **SkillBridge** on your local machine.

### Prerequisites

Make sure you have the following installed on your system:

1. [Node.js](https://nodejs.org/?utm_source=gemini) (v18 or higher)

2. [Git](https://git-scm.com/?utm_source=gemini)

3. [MongoDB Server](https://www.mongodb.com/try/download/community?utm_source=gemini) running locally on port `27017` **OR** a MongoDB Atlas Connection String.

### Step 1: Clone the Repository

Open your terminal or command prompt and run:

```
git clone https://github.com/Soyam14/Sprint-1.git
cd Sprint-1

```

### Step 2: Set Up the Backend Server

1. Navigate into the **`Backend`** directory:

   ```
   cd Backend
   
   ```

2. Install all required dependencies:

   ```
   npm install
   
   ```

3. Create a `.env` file in the root of the **`Backend`** directory and configure your environment variables:

   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/skillbridge
   JWT_SECRET=your_super_secret_jwt_key
   FRONTEND_URL=http://localhost:5173
   
   ```

4. Start the backend development server:

   ```
   npm run dev
   # or: node server.js
   
   ```

   *You should see `Server running on port 5000` and `MongoDB Connected` in your console.*

### Step 3: Set Up the Frontend UI

1. Open a new terminal window/tab and navigate into the **`frontend`** directory:

   ```
   cd frontend
   
   ```

2. Install all frontend dependencies:

   ```
   npm install
   
   ```

3. Start the Vite development server:

   ```
   npm run dev
   
   ```

4. Open your web browser and visit:

   ```
   http://localhost:5173
   
   ```

## 📁 Repository Structure

```
Sprint-1/
├── Backend/
│   ├── config/          # MongoDB Database Connection
│   ├── middleware/      # JWT Authentication Middleware
│   ├── models/          # User, Skill, Connection, Message Schemas
│   ├── routes/          # Express API Endpoints
│   └── server.js        # Entry point for Server & Socket.io
├── frontend/
│   ├── public/          # Static Assets
│   ├── src/
│   │   ├── components/  # Navigation, Cards, Modals
│   │   ├── context/     # Auth & Socket Context Providers
│   │   ├── pages/       # Explore, Requests, Chat, Login
│   │   └── App.jsx      # Application Routes & App Layout
└── README.md

```

## 📜 License

This project is created for educational and portfolio presentation purposes under the Sprint-1 milestone.
