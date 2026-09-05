# 📦 Sharing Platform (RentIt)

A full-stack web application for renting and sharing items. Built with React, TypeScript, and Node.js, featuring real-time chat and a fully responsive, mobile-first design.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)

## 📌 Features

- **Real-time Communication:** Instant messaging between item owners and renters using WebSockets (Socket.io).
- **Responsive UI:** Pixel-perfect, mobile-friendly interface with iOS Safe Area adaptations.
- **Smart Pagination:** Infinite scrolling implemented with a custom Intersection Observer.
- **Secure Authentication:** JWT-based user authentication and authorization.
- **Image Optimization:** Automatic image resizing and face-cropping via Cloudinary API.

## 💻 Tech Stack

**Frontend:**
- React (Vite)
- TypeScript
- SCSS (CSS Modules & Mixins)
- React Router DOM
- Axios

**Backend:**
- Node.js & Express
- PostgreSQL (pg)
- Socket.io
- Cloudinary (Multer)

## 📸 Screenshots

<img width="1710" height="1107" alt="Снимок экрана 2026-09-05 в 11 46 07" src="https://github.com/user-attachments/assets/e79be6c5-a403-4258-8d8d-aee3619aef17" />

<img width="1710" height="1107" alt="Снимок экрана 2026-09-05 в 11 46 40" src="https://github.com/user-attachments/assets/a4881c60-fc57-452d-af41-d7425c55ffd5" />

<img width="1710" height="1107" alt="Снимок экрана 2026-09-05 в 11 56 18" src="https://github.com/user-attachments/assets/7d24f3dd-b562-43c3-8f2c-bee3dc9ce4ec" />

<img width="1710" height="1107" alt="Снимок экрана 2026-09-05 в 11 56 51" src="https://github.com/user-attachments/assets/6b465694-886b-4ed1-90ee-3a2539df38be" />

<img width="300" height="650" alt="Simulator Screenshot - iPhone 17 - 2026-09-05 at 12 14 51" src="https://github.com/user-attachments/assets/9cab7443-9d1b-4418-86e7-3e50c8411b23" />

<img width="300" height="650" alt="Simulator Screenshot - iPhone 17 - 2026-09-05 at 12 15 17" src="https://github.com/user-attachments/assets/4b3a29db-fd46-4c00-86a9-a6709ac969fd" />

<img width="300" height="650" alt="Simulator Screenshot - iPhone 17 - 2026-09-05 at 12 16 04" src="https://github.com/user-attachments/assets/6fd692d3-e027-4717-a240-452e89703a0e" />

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL

### Installation

1. **Clone the repository:**
```bash
git clone [https://github.com/Ageyan/my-sharing-platform.git](https://github.com/Ageyan/my-sharing-platform.git)
```

2. **Install frontend dependencies:**
```bash
cd frontend
npm install
```

3. **Install backend dependencies:**
```bash
cd backend
npm install
```

4. **Set up environment variables:**
Create `.env` files in both `frontend` and `backend` directories based on `.env.example`.

5. **Start the development servers:**
```bash
npm run dev
```
