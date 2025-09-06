
# EcoFinds Frontend

A modern, responsive frontend for the EcoFinds sustainable marketplace, built with React, Vite, TypeScript, shadcn-ui, and Tailwind CSS.

## Features

- 🔐 User authentication (sign up, sign in, JWT-based)
- 🛍️ Product listing, search, and filtering
- 🗂️ Category browsing and filtering
- 🛒 Shopping cart and wishlist management
- 💬 Real-time chat (Socket.IO integration)
- 📦 Product detail and add-to-cart
- 📝 Add/edit product listings (for sellers)
- 📱 Responsive design for mobile and desktop
- 🌙 Light/dark mode support

## Tech Stack

- React
- Vite
- TypeScript
- shadcn-ui (UI components)
- Tailwind CSS (utility-first styling)
- Context API (state management)
- Socket.IO-client (real-time chat)
- Fetch API (backend communication)

## Implementation Notes

- Uses Context Providers for Auth, Cart, Search, and Wishlist
- Product data is fetched from the backend API (`/api/products`)
- Authentication state is persisted with JWT in localStorage
- UI built with shadcn-ui and Tailwind for a modern look
- All API URLs are configured for local development (`localhost:3001`)

## Getting Started

1. Install dependencies:
	```bash
	npm install
	```
2. Start the development server:
	```bash
	npm run dev
	```
3. The app will be available at `http://localhost:5173` (or the port shown in your terminal)

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # UI and page components
│   ├── contexts/        # React context providers
│   ├── data/            # Mock data (for development)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components (routing)
│   ├── scenes/          # Scene-based UI (optional)
│   ├── types/           # TypeScript types
│   └── App.tsx          # Main app entry
├── package.json
└── tailwind.config.ts
```

## Environment Variables

No environment variables are required for local development. API URLs are hardcoded for localhost. If deploying, update API URLs as needed.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

