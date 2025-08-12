# 🛒 E-Commerce Store

A **fully functional, modern e-commerce store** built with **Node.js (Express)**, **MongoDB**, and **Vanilla JavaScript** with **Tailwind CSS** for a responsive and visually appealing design.

---

## 🚀 Features

- 🏠 **Homepage** with featured products and categories  
- 📦 **Product Listings** with search & filter options  
- 🛍 **Product Details Page**  
- 🛒 **Shopping Cart** with add/remove/update functionality  
- 💳 **Order Checkout & Processing**  
- 🔐 **User Authentication** (Register / Login / Logout)  
- 📂 **MongoDB Database** for products, users, and orders  
- 📱 **Fully Responsive** (Mobile, Tablet, Desktop)  
- 🎨 **Modern UI** with Tailwind CSS

---

## 🖥 Tech Stack

**Frontend**
- HTML5, CSS3, JavaScript (ES6+)
- Tailwind CSS

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose

**Other Tools**
- dotenv
- cookie-parser
- cors

---
## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/ecommerce-store.git
cd ecommerce-store
2️⃣ Install dependencies
npm install

3️⃣ Setup environment variables
Create a .env file in the root and add:
MONGO_URI=mongodb://127.0.0.1:27017/ECOMMERCE-STORE
PORT=4000
CLIENT_ORIGIN=http://localhost:3000

4️⃣ Run the development server
node server.js
Visit: http://localhost:4000

📁 Project Structure
ecommerce-store/
│-- public/             # Frontend HTML, CSS, JS
│-- routes/             # API routes
│-- models/             # Mongoose models
│-- config/             # Database configuration
│-- server.js           # Main server file
│-- package.json
│-- .env.example
🛠 Future Improvements
✅ Payment Gateway Integration (Stripe/PayPal)

✅ Admin Dashboard for Product Management

✅ Wishlist & Product Reviews

✅ Advanced Search & Filtering
