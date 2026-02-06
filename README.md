# 💰 Money Manager (WealthWise)

A professional, full-stack financial tracking application built to help users manage their income, expenses, and budgets with ease.

![Dashboard Preview](https://wealth-wise-bay.vercel.app/assets/dashboard-preview.png)
*(Note: Replace with actual screenshot path if available)*

## 🚀 Live Demo
- **Frontend**: [https://wealth-wise-bay.vercel.app](https://wealth-wise-bay.vercel.app)
- **Backend API**: [https://wealthwise-5du8.onrender.com/api/v1/health](https://wealthwise-5du8.onrender.com/api/v1/health)

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: TailwindCSS, HeroUI
- **State Management**: Zustand
- **Charting**: Recharts
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Joi / Zod

---

## ✨ Key Features

1.  **Dashboard**: Visual trends of Income vs Expenses using interactive Bar/Line/Area/Bubble charts.
2.  **Transaction Management**: Add, edit, delete, and filter transactions by type, category, and date.
3.  **Smart Categorization**: Default categories + Custom emojis for personal finance tracking.
4.  **Division Switching**: Toggle between **Personal** and **Office** financial views.
5.  **Secure Auth**: User registration and login with rate-limiting protection.
6.  **Responsive Design**: Fully mobile-optimized interface with glassmorphism aesthetics.

---

## 🏗️ Local Setup Guide

### Prerequisites
- Node.js (v18+)
- MongoDB connection string

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/money-manager-frontend.git
git clone https://github.com/YOUR_USERNAME/money-manager-backend.git
```

### 2. Backend Setup
```bash
cd money-manager-backend
npm install

# Create .env file
echo "PORT=5000" > .env
echo "MONGO_URI=your_mongodb_connection_string" >> .env
echo "JWT_SECRET=your_secret_key" >> .env
echo "FRONTEND_URL=http://localhost:5173" >> .env

npm run dev
```

### 3. Frontend Setup
```bash
cd money-manager-frontend
npm install

npm run dev
```

Access the app at `http://localhost:5173`.

---

## 📦 Deployment

### Backend (Render)
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Env Vars**: `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL` (No trailing slash!)

### Frontend (Vercel)
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Env var**: `VITE_API_URL` (Point to your Render Backend URL)

---

## 📄 License
This project is open-source and available under the MIT License.
