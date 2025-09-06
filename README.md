
# EcoFinds Marketplace

A full-stack sustainable marketplace platform for buying, selling, and chatting about pre-loved products. Built with a modern TypeScript stack: Node.js, Express, Prisma, PostgreSQL, React, Vite, Tailwind CSS, and Socket.IO.

---

## ✨ Features

- 🔐 <b>User authentication</b> (JWT-based)
- 🛍️ <b>Product listing, search, and filtering</b>
- 🗂️ <b>Category management</b>
- 🛒 <b>Shopping cart and order management</b>
- 💬 <b>Real-time chat between users</b>
- 🔔 <b>Notifications</b>
- 🖼️ <b>Image upload (Cloudinary)</b>
- 📱 <b>Responsive, modern UI</b>

---

## 🛠️ Tech Stack

<details>
<summary><b>Backend</b></summary>

- Node.js, Express.js, TypeScript
- Prisma ORM, PostgreSQL
- Socket.IO (real-time chat)
- Cloudinary (image hosting)
- JWT (authentication)
</details>

<details>
<summary><b>Frontend</b></summary>

- React, Vite, TypeScript
- shadcn-ui, Tailwind CSS
- Context API (state management)
- Socket.IO-client
</details>

---

## 📁 Monorepo Structure

```text
odoo/
├── backend/   # Node.js/Express/Prisma API
│   ├── src/
│   ├── prisma/
│   └── ...
├── frontend/  # React/Vite/Tailwind UI
│   ├── src/
│   └── ...
└── README.md  # (this file)
```

---

## 🚀 Getting Started

### Backend
```bash
cd backend
npm install
cp .env.example .env # and fill in your config
npx prisma migrate dev # setup DB
npm run db:seed       # (optional) seed sample data
npm run dev           # start server
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Visit http://localhost:5173
```

---

## 📚 API & Docs

- Backend API: runs on [`http://localhost:3001`](http://localhost:3001)
- Frontend: runs on [`http://localhost:5173`](http://localhost:5173)
- See [`backend/README.md`](backend/README.md) and [`frontend/README.md`](frontend/README.md) for detailed docs and endpoints

---

