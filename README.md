# Pizza Palace

Pizza Palace is a modern full-stack pizza ordering web application built with React, Tailwind CSS, Firebase Authentication, Node.js, Express.js, and MongoDB. The platform allows users to browse pizzas, manage their cart, place orders, and track order history through a clean and responsive interface.

## Features

### Customer Features
- Browse pizza menu
- Search and filter pizzas
- View pizza details
- Add items to cart
- Manage cart items
- Secure authentication with Firebase
- Checkout and place orders
- View order history

### Admin Features
- Admin dashboard
- Manage pizzas (CRUD operations)
- Manage customer orders
- Update order status
- Monitor platform activities

## Tech Stack

### Frontend
- React.js
- React Router DOM
- Tailwind CSS
- Context API
- Firebase Authentication

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Project Structure

```text
pizza/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PizzaCard.jsx
│   │   │   └── Sidebar.jsx
│   │   │
│   │   ├── context/
│   │   │   └── CartContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signin.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   └── Orders.jsx
│   │   │
│   │   ├── firebase/
│   │   │   └── firebase.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── server.js
│   └── package.json
│
└── README.md
```

## Installation

### Clone the Repository

```bash
git clone https://github.com/praveen-analyze/pizza.git
cd pizza
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

## Environment Variables

### Frontend (.env)

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Backend (.env)

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

## API Endpoints

### Pizza APIs

```http
GET    /api/pizzas
GET    /api/pizzas/:id
POST   /api/pizzas
PUT    /api/pizzas/:id
DELETE /api/pizzas/:id
```

### Order APIs

```http
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PUT    /api/orders/:id
DELETE /api/orders/:id
```

## Future Enhancements

- Online payment integration
- Real-time order tracking
- Customer reviews and ratings
- Favorites and wishlist
- Email notifications
- Analytics dashboard
- Delivery status updates

## Author

Praveen Kumar

GitHub: https://github.com/praveen-analyze

## License

This project is developed for educational, learning, and portfolio purposes.
