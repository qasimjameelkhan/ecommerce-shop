# 🛒 E-commerce Shop (Node.js + MongoDB)

A simple and scalable e-commerce backend API built with Node.js, Express, and MongoDB.

Supports user authentication, product management, and order handling.


# 🚀 Features

User authentication (JWT-based)

Product CRUD operations

Order creation & management

MongoDB with Mongoose

Secure environment configuration with .env

Middleware-based authentication & error handling

📂 Project Structure
ecommerce-shop-master/
│── server.js          # Entry point
│── config/db.js       # Database connection
│── controllers/       # Route logic (Auth, Products, Orders)
│── models/            # Mongoose models
│── middleware/Auth.js # JWT Authentication
│── .env.example       # Example environment file
│── package.json       # Dependencies & scripts

🔧 Installation

Clone the repo:

git clone https://github.com/your-username/ecommerce-shop.git
cd ecommerce-shop


Install dependencies:

npm install


Set up environment variables:

Copy .env.example → .env

Add your MongoDB URI, JWT secret, and other configs.

▶️ Running the App

Start the server:

npm start


For development with hot reload:

npm run dev


Server runs on http://localhost:5000
 (default).

📌 API Endpoints
Auth

POST /api/auth/register – Register new user

POST /api/auth/login – Login and get JWT

Products

GET /api/products – Get all products

POST /api/products – Add a product (admin only)

PUT /api/products/:id – Update product

DELETE /api/products/:id – Delete product

Orders

GET /api/orders – Get user’s orders

POST /api/orders – Place a new order

🛠️ Tech Stack

Node.js + Express.js

MongoDB + Mongoose

JWT Authentication

dotenv for environment management

🤝 Contributing

Pull requests are welcome!
For major changes, please open an issue first to discuss your idea.

📄 License

This project is licensed under the MIT License.
