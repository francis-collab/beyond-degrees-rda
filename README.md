# 🌍 Beyond Degrees Rwanda (BDR)

A full-stack platform empowering Rwandan youth, entrepreneurs, and innovators by enabling fundraising, project creation, job creation, and community impact.  
This system includes a **Next.js frontend**, a **FastAPI backend**, and a **PostgreSQL (or SQLite dev) database** with Alembic migrations.

🚀 **Live Platform:** https://beyond-degrees-rda.vercel.app

---

## 🛠️ Features

- 👥 User roles: Entrepreneur, Backer, Admin  
- 🧾 Project creation with image & business plan (PDF) uploads  
- 💰 Funding logic & transactions model  
- 📊 Admin dashboard (stats: total funds, jobs created, users, projects, messages)  
- 🔔 Notification system (in-app alerts)  
- 📨 Built-in messaging (contact form → backend email handler)  
- 📂 Static file serving for images/PDFs  
- 🗃️ SQLite for local dev, PostgreSQL (Neon/Render) for production  
- 🔄 Alembic migrations  
- 🌐 Fully separated frontend & backend with clean API architecture  

---

## 🧱 Tech Stack

### **Frontend**
- Next.js  
- React  
- TailwindCSS  
- Axios  
- Vercel Deployment  

### **Backend**
- FastAPI  
- SQLAlchemy ORM  
- Pydantic  
- Alembic Migrations  
- PostgreSQL (production)  
- SQLite (development)  
- Uvicorn Server  

### **Deployment**
- Frontend → **Vercel**  
- Backend → (Render / Railway / any VPS)  
- Database → **Neon PostgreSQL** or Render PostgreSQL  

---

## 📦 Prerequisites

Ensure you have:

- Python 3.9+  
- Node.js 18+  
- npm or yarn  
- git  
- PostgreSQL OR Neon database account (optional if using SQLite locally)

---

# ⚙️ Local Development Setup

**Below is the FULL setup for running both backend + frontend on your machine**.

---

## 🔧 1. Clone the Repository

```bash
git clone https://github.com/francis-collab/beyond-degrees-rda.git
cd beyond-degrees-rda

# 🐍 Backend Setup (FastAPI)

## 📁 2. Navigate to Backend Folder

```bash
cd bdr-backend
```
## 🧬 3. Create Virtual Environment & Install Dependencies

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## 🔑 4. Create .env File

**Inside bdr-backend/, create a .env file**:

```bash
DATABASE_URL=sqlite:///./bdr.db

SECRET_KEY=your-secret-key  
ALGORITHM=HS256  
ACCESS_TOKEN_EXPIRE_MINUTES=1440

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_email_password
EMAIL_FROM=your_email@gmail.com

FRONTEND_URL=http://localhost:3000
ALLOWED_HOSTS=["*"]
DEBUG=True
```
  ⚠️ **Never commit real secrets. Use .env.**

  ## 🛢️ 5. Run Alembic Migrations (for PostgreSQL or SQLite)

  ```bash
  alembic upgrade head
```

## ▶️ 6. Start Backend Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
    **Backend Running at**:
👉 `http://localhost:8000/docs`

# ⚛️ Frontend Setup (Next.js)

## 📁 7. Navigate to Frontend Folder

``bash 
cd ../frontend
```

## 📦 8. Install Dependencies

```bash
npm install
```

## 🔑 9. Create .env.local File

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```
## ▶️ 10. Run Frontend

```bash
npm run dev
```
   **Frontend Running at**:
👉 `http://localhost:3000`

# 🛢️ Migrating From SQLite → PostgreSQL (Neon / Render)

**To prepare for production**:

## 1️⃣ Replace DATABASE_URL in .env

**Example Neon URI**:

```bash
postgresql://neondb_owner:password@ep.example.neon.tech/neondb?sslmode=require
```

## 2️⃣ Re-run Alembic on PostgreSQL

```bash
alembic upgrade head
```

## 3️⃣ Done. Tables & data structure now in PostgreSQL.

# 🚀 Production Deployment Guide

**This section explains deploying both sides**.

## 🌐 Frontend Deployment (Vercel)

### 1. Push your frontend to GitHub
### 2. Go to Vercel → "New Project"
### 3. Import the GitHub repo
### 4. Set the environment variable:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain
```
### 5. Deploy 🎉

**Live Frontend**:
`https://beyond-degrees-rda.vercel.app`

## 🖥️ Backend Deployment (Render / Railway / VPS)

### 1. Connect GitHub repo
### 2. Add environment variables:

```bash
DATABASE_URL=<your_postgres_url>
SECRET_KEY=<your_key>
ALGORITHM=HS256
SMTP credentials...
FRONTEND_URL=https://beyond-degrees-rda.vercel.app
```
### 3. Build command:

```bash
pip install -r requirements.txt
```
### 4. Start command:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```
### 5. Run migrations:

```bash
alembic upgrade head
```
### 6. Backend will auto-serve static files like:
```bash
/static/uploads/projects/<image>
/static/uploads/business_plans/<pdf>
```
## 🧩 Repository Structure

```
beyond-degrees-rda/
├── bdr-backend/
│   ├── app/
│   ├── migrations/
│   ├── static/
│   │   ├── uploads/
│   │   │   ├── projects/
│   │   │   └── business_plans/
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
└── frontend/
    ├── pages/
    ├── components/
    ├── public/
    ├── styles/
    ├── package.json
    ├── .env.local
    └── next.config.js
```

## 🔐 Environment Variables Summary

**Backend**

```bash
DATABASE_URL=
SECRET_KEY=
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=

FRONTEND_URL=
ALLOWED_HOSTS=
DEBUG=
JOB_CREATION_RATE=
```

**Frontend**

```bash
NEXT_PUBLIC_API_BASE_URL=
```

## 🧪 Common Issues & Fixes

```bash
| Issue                      | Cause                                | Fix                                 |
| -------------------------- | ------------------------------------ | ----------------------------------- |
| Static images not loading  | Missing upload folders               | Create folders `static/uploads/...` |
| CORS errors                | Backend not allowing frontend domain | Add domain in FastAPI CORS config   |
| PostgreSQL migration fails | Wrong DATABASE_URL                   | Ensure full SSL connection string   |
| 500 errors on Render       | Missing environment variables        | Add all variables exactly           |
```
## 🤝 Contributing

### 1. Fork project
### 2. Create branch: git checkout -b feature/my-feature
### 3. Commit changes
### 4. Push & open PR

## 👨‍💻 Author

**Francis Mutabazi**  
Built with ❤️ for Rwanda’s youth empowerment.

## 📜 License

This project is open-source and free to use.