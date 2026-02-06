# 🎓 Student Performance Prediction System

A **full-stack Machine Learning web application** that predicts a student’s **final academic performance** based on demographic, academic, and lifestyle factors.  
Built with **FastAPI + Next.js + MongoDB + Machine Learning**.

> 🚀 Designed as a real-world, production-style project for learning **Full-Stack + ML integration**.

---

## ✨ Key Highlights

✅ End-to-End Full Stack Project  
✅ Machine Learning Model Integration  
✅ Secure Authentication System  
✅ User-Specific Dashboard & History  
✅ Beginner-friendly yet industry-style architecture  

---

## 🚀 Features

### 🔐 Authentication
- User **Sign Up & Sign In**
- Secure password hashing (Passlib)
- JWT-based authentication
- New user vs existing user handling

### 🧠 Machine Learning
- Trained regression model using **Scikit-learn**
- Predicts final academic score
- Model saved & loaded using **Joblib**

### 📊 Dashboard
- Fresh dashboard for new users
- Saved prediction history for existing users
- Personalized insights per user

### 🔄 Full Stack Integration
- Secure Frontend ↔ Backend communication
- REST APIs using FastAPI
- MongoDB for persistent storage

---

## 🛠 Tech Stack

### 🖥 Frontend
- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**

### ⚙️ Backend
- **FastAPI**
- **JWT Authentication**
- **MongoDB (Motor)**
- **Passlib (Password Hashing)**

### 🤖 Machine Learning
- **Scikit-learn**
- Regression Model
- Joblib (Model Persistence)

---

## 📂 Project Structure

student-performance-prediction/
│
├── frontend/
│ ├── app/
│ ├── components/
│ ├── hooks/
│ ├── lib/
│ └── package.json
│
├── backend/
│ ├── app/
│ │ ├── routes/
│ │ ├── schemas/
│ │ ├── services/
│ │ ├── core/
│ │ ├── ml/
│ │ └── main.py
│ └── requirements.txt
│
├── .gitignore
└── README.md

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/student-performance-prediction.git
cd student-performance-prediction

# Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux

pip install -r requirements.txt
uvicorn app.main:app --reload

📍 Backend runs at:
http://127.0.0.1:8000

#Frontend Setup 
cd frontend
npm install
npm run dev

📍 Frontend runs at:
http://localhost:3000

🔐 Authentication Flow

1️⃣ User signs up
2️⃣ Password securely hashed
3️⃣ User logs in
4️⃣ JWT token generated
5️⃣ Token used for:

Prediction access

Dashboard data

User-specific history

📊 Prediction Workflow

1️⃣ User fills multi-step form
2️⃣ Data sent to backend
3️⃣ ML model predicts final score
4️⃣ Result stored in database
5️⃣ Prediction displayed on dashboard

🧾 Dashboard Features

Total predictions count

Average predicted score

Best predicted score

Complete user-specific prediction history

📌 Future Improvements

🚀 Data visualization charts
🚀 Model comparison (multiple ML models)
🚀 Deployment (Vercel + Render)
🚀 Admin analytics panel

👨‍💻 Author

Khush Trivedi
Engineering Student
Machine Learning & Full-Stack Development Enthusiast

⭐ If you like this project, give it a star and feel free to fork it!
