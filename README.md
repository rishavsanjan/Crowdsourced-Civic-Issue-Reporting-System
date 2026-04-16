# 🚀 Crowdsourced Issue Reporting and Resolution System

A smart civic issue management platform that enables citizens to report problems (like garbage, potholes, street lights, etc.), and helps authorities efficiently manage and resolve them using **Machine Learning (BERT-based classification)**.

---

## 📌 Project Overview

Urban areas face many civic issues, but existing complaint systems are slow, manual, and lack transparency.

This project provides a **modern, intelligent, and scalable solution** with:

* 📱 Mobile app for citizens
* 👷 Mobile app for workers
* 💻 Web dashboard for administrators
* 🤖 AI-based complaint classification

---

## ✨ Key Features

### 👤 Citizen App

* Register/Login
* Raise complaints with image/video
* Track complaint status (real-time)
* View complaint history

### 👷 Worker App

* View assigned tasks
* Update complaint status
* Upload work completion proof
* Track work history

### 🛠️ Admin Dashboard

* Manage complaints and users
* Assign tasks to workers
* View analytics and statistics
* Map-based complaint visualization

---

## 🤖 Machine Learning (Core Feature)

### 🔹 BERT-Based Complaint Classification

* Uses **BERT (Bidirectional Encoder Representations from Transformers)**
* Automatically classifies complaints into departments like:

  * Electricity ⚡
  * Roads 🛣️
  * Garbage 🗑️
  * Water 💧

### ✅ Why BERT?

* Understands **context and meaning** of text
* Handles **ambiguous complaints** better
* More accurate than traditional models like SVM

---

## 🏗️ Tech Stack

### Frontend

* React Native (Mobile Apps)
* React.js (Admin Dashboard)

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL
* Prisma ORM

### Machine Learning

* Python
* BERT (Transformers)
* Scikit-learn (initial experimentation)

---

## 🧠 System Architecture

```
User App  →  Backend API  →  Database
                  ↓
           ML Model (BERT)
                  ↓
         Admin Dashboard / Worker App
```

---

## 📊 Workflow

1. User submits complaint
2. Complaint is sent to backend
3. BERT model classifies department
4. Admin assigns task to worker
5. Worker resolves and uploads proof
6. User tracks status in real-time

---


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2️⃣ Backend setup

```bash
cd backend
npm install
npm run dev
```

### 3️⃣ Frontend setup

```bash
cd frontend
npm install
npm run dev
```

### 4️⃣ ML Model setup

```bash
cd ml-model
pip install -r requirements.txt
python app.py
```

---

## 📈 Future Improvements

* 🔥 Image-based complaint classification
* 🌍 Multilingual support (Hindi, Marathi, etc.)
* 📊 Advanced analytics dashboard
* ⚡ Real-time notifications using WebSockets
* 🧠 Improved fine-tuned transformer models

---

## 🎯 Key Advantages

* ✅ Faster complaint resolution
* ✅ Intelligent routing using AI
* ✅ Transparency for citizens
* ✅ Data-driven governance

---

## 👨‍💻 Author

**Rishav Sanjan**
MCA, Maulana Azad National Institute of Technology, Bhopal

---

## 📜 License

This project is for academic and research purposes.

---

## ⭐ If you like this project

Give it a star ⭐ on GitHub!
