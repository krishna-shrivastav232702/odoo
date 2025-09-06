# EcoFinds Backend

A sustainable marketplace backend built with Node.js, Express, TypeScript, Prisma, PostgreSQL, and Socket.IO for real-time chat functionality.

## Features

- 🔐 **Authentication & User Management** - JWT-based auth with user profiles
- 📦 **Product Management** - Full CRUD operations for product listings
- 🛒 **Shopping Cart** - Add, update, remove items from cart
- 💳 **Order Management** - Complete checkout and order tracking
- 💬 **Real-time Chat** - Socket.IO powered messaging between buyers and sellers
- 🔍 **Search & Filtering** - Full-text search with category and price filters
- 📱 **RESTful API** - Clean, documented API endpoints
- 🗄️ **PostgreSQL Database** - Robust data storage with Prisma ORM

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and JWT secret
   ```

3. **Set up database**
   ```bash
   # Push schema to database
   npm run db:push
   
   # Seed with sample data
   npm run db:seed
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update user profile

### Products
- `GET /api/products` - Get all products (with search/filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (auth required)
- `PUT /api/products/:id` - Update product (auth required)
- `DELETE /api/products/:id` - Delete product (auth required)
- `GET /api/products/user/my-products` - Get user's products

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category with products

### Shopping Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Orders
- `POST /api/orders/checkout` - Create order from cart
- `GET /api/orders/purchases` - Get purchase history
- `GET /api/orders/sales` - Get sales history
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status

### Chat
- `GET /api/chat/conversations` - Get user's conversations
- `POST /api/chat/conversations` - Start new conversation
- `GET /api/chat/conversations/:id/messages` - Get conversation messages
- `POST /api/chat/conversations/:id/messages` - Send message
- `PUT /api/chat/conversations/:id/read` - Mark messages as read
- `GET /api/chat/unread-count` - Get unread message count

## Socket.IO Events

### Client to Server
- `join_conversation` - Join a conversation room
- `leave_conversation` - Leave a conversation room
- `send_message` - Send a message
- `mark_messages_read` - Mark messages as read
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator

### Server to Client
- `new_message` - New message received
- `new_message_notification` - Message notification
- `messages_read` - Messages marked as read
- `user_typing` - User is typing
- `user_stopped_typing` - User stopped typing

## Database Schema

The application uses the following main entities:
- **Users** - User accounts and profiles
- **Products** - Product listings with categories
- **Categories** - Product categories
- **CartItems** - Shopping cart items
- **Orders** - Purchase orders
- **OrderItems** - Individual items in orders
- **Conversations** - Chat conversations between users
- **Messages** - Chat messages
- **Notifications** - User notifications

## Sample Users

After running the seed script, you can use these test accounts:

- **Email:** john@example.com | **Password:** password123
- **Email:** jane@example.com | **Password:** password123
- **Email:** mike@example.com | **Password:** password123
- **Email:** sarah@example.com | **Password:** password123

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset database and reseed

## Environment Variables

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key
DATABASE_URL=postgresql://username:password@localhost:5432/ecofinds
```

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT
- **Real-time:** Socket.IO
- **Validation:** express-validator
- **Security:** bcryptjs, helmet, cors

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── routes/          # API routes
│   ├── socket/          # Socket.IO handlers
│   └── index.ts         # Main server file
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Database seeding
└── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details