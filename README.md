# 🛍️ e-comers: Premium E-Commerce Suite

A high-performance, full-stack shopping application featuring a modern **Node.js/Express** backend and a dynamic **React** (Vite) frontend.

## ✨ Core Implementations

- **🔒 Username-Based Auth**: Secure Login/Register system powered by JWT and Bcrypt, using usernames for a streamlined experience.
- **🛒 Dynamic Shopping Cart**: Fully functional cart system with real-time total calculations and persistence in MongoDB.
- **📋 Order Management**: Transparent checkout flow that converts carts to orders with instant history tracking.
- **🎨 Premium UI/UX**: State-of-the-art design using Tailwind CSS, Lucide icons, and modern glassmorphism aesthetics.
- **⚡ High Performance**: Blazing fast responses using Node.js 18+ and React 18+ with Vite.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, Mongoose, JWT, Bcrypt.
- **Frontend**: React, Vite, Tailwind CSS, Axios, Lucide React.
- **Database**: MongoDB (Local).

---

## 🚀 How to Run Manually (VS Code)

To get the application running on your local machine, follow these steps in your VS Code terminal:

### Step 1: Launch the Backend
1. Open a **new terminal** in VS Code (`Ctrl+Shift+``).
2. Change directory to the api folder:
   ```powershell
   cd shopping-cart-app/api
   ```
3. Initialize dependencies and start the server:
   ```powershell
   `   npm install
      npm start`
   ```
   > [!NOTE]
   > The backend server will be listening on **http://localhost:5000**.

### Step 2: Launch the Frontend
1. Open a **second terminal** tab in VS Code (click the '+' icon in the terminal panel).
2. Change directory to the frontend folder:
   ```powershell
   cd shopping-cart-app/frontend
   ```
3. Install dependencies and start the development server:
   ```powershell
   npm install
   npm run dev
   ```
   > [!TIP]
   > The frontend will be available at **http://localhost:5173**.

---

## ✅ Implementation Details
- **Data Persistence**: Uses a `Cart` and `Order` model in MongoDB to track user activity.
- **Security**: JWT tokens are stored in `localStorage` and sent with every protected API request.
- **Product Seeding**: The server automatically seeds 20 premium products upon the first connection to MongoDB.
- **Error Safety**: Integrated `toFixed(2)` guards across the UI to prevent crashes from null data.

---
*Created with ❤️ for a premium shopping experience.*
