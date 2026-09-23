# 📔 Personal Diary with Mood Tracking

> Personal Diary with Mood Tracking is a full-stack web application designed to help users record their daily experiences and manually track their moods. Users can create diary entries, select their mood and intensity, add tags, and review their previous entries and mood patterns. The application aims to encourage self-reflection, emotional awareness, and mindful journaling through a simple and organised digital diary.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-REST%20API-000000?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-NoSQL-47A248?logo=mongodb)](https://www.mongodb.com/)


##  Key Features

- 🔐 User registration and authentication
- 📝 Create, view, update, and delete diary entries
- 😊 Manual mood tracking
- 📊 Mood intensity scale from **1–10**
- 🏷️ Tags for organising diary entries
- 📅 Date and calendar-based diary management
- 🔎 Search and filter functionality
- 📈 Mood charts and visualisations
- 🖼️ Media/photo upload support
- 👤 User-specific diary data
- 📱 Responsive user interface

## 🛠️ Technology Stack

### Frontend
- **Next.js 15**
- **React**
- **Chakra UI**
- **Chart.js**
- JavaScript / TypeScript

### Backend
- **Node.js**
- **Express.js**
- RESTful APIs

### Database & Storage
- **MongoDB**
- **Amazon S3** for media/photo storage

### Deployment & Tools
- **Git & GitHub**
- **Vercel**
- **Render**

##  Architecture

The application follows a client-server architecture:

```text
┌──────────────────────────────┐
│          Frontend            │
│       Next.js + React        │
└──────────────┬───────────────┘
               │
               │ REST API
               ▼
┌──────────────────────────────┐
│           Backend            │
│      Node.js + Express       │
└───────┬───────────────┬──────┘
        │               │
        ▼               ▼
┌──────────────┐  ┌──────────────┐
│   MongoDB    │  │  Amazon S3   │
│  Diary Data  │  │ Media/Photos │
└──────────────┘  └──────────────┘
```

##  Project Structure

```text
Personal_diary_with_mood_tracking/
│
├── frontend-personal-diary-main/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── personal-diary-main/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── db.js
│   ├── index.js
│   └── package.json
│
└── README.md
```

##  Project Objectives

The project was developed with the following objectives:

- Provide users with a convenient digital diary.
- Encourage regular self-reflection.
- Allow users to record their moods and mood intensity.
- Help users organise and review their diary history.
- Present mood information in an easy-to-understand visual format.
- Build a foundation for future intelligent mood-analysis features.

##  Future Scope

The application can be extended with:

- 🤖 AI/ML-based mood prediction
- 🧠 Emotion analysis from diary content
- 💡 Personalised daily prompts
- 🔔 Reminders and notifications
- 🔒 Two-factor authentication and stronger security
- 📶 Offline access
- 📤 Diary export and backup
- 🎙️ Voice-based diary entries
- 📊 More advanced mood analytics

##  Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/bijoykhisa666/Personal_diary_with_mood_tracking.git
cd Personal_diary_with_mood_tracking
```

### 2. Frontend setup

```bash
cd frontend-personal-diary-main
npm install
npm run dev
```

### 3. Backend setup

Open another terminal:

```bash
cd personal-diary-main
npm install
npm start
```




##  Academic Project

This project was developed as an undergraduate academic/final-year project in Computer Science & Engineering.

---

