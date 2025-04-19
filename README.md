# 🛒 ShopSwift API

**ShopSwift API** is a fully-featured eCommerce backend built with Node.js, Express.js, and MongoDB. It supports user authentication, product management, cart functionality, 
and order placement. Designed with scalability and maintainability in mind, this RESTful API is perfect for modern eCommerce applications.

---

## 🚀 Features

- 🔐 **User Authentication** (Register, Login, JWT-based)
- 🧑‍💼 Role-based Access (Customer/Admin)
- 📦 **Product CRUD** (Create, Read, Update, Delete)
- 🛒 **Cart System** (Add to cart, update quantity, remove items)
- 📬 **Order System** (Place orders, order history)
- 🧾 **Admin Dashboard Routes**
- 📄 API Testing via **Postman Collection**
- 🧠 Clean Code Structure with MVC pattern
- 🛡️ Protected Routes via Middleware
- ✅ MongoDB with Mongoose ODM

---

## 📁 Project Structure

├── controllers/
├── db/
├── middlewares/
├── models/
├── routes/
├── utils/
├── app.js
├── constant.js
├── index.js
├── .env
└── README.md

---

## ⚙️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Auth:** JWT, bcrypt
- **Testing:** Postman
- **Deployment:** Render


## 📦 Installation & Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/harshsingh26/ShopSwift-API.git
   cd ShopSwift-API
   
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```env
   PORT=8000
   DB_URL=your_mongodb_connection_string
   CORS = your_cors_url
   ACCESS_TOKEN_SECRET = your_secret_key
   ACCESS_TOKEN_EXPIRY = set expiry
   REFRESH_TOKEN_SECRET = your_secret_key
   REFRESH_TOKEN_EXPIRY = set_expiry
   CLOUDINARY_CLOUD_NAME = set your cloud name
   CLOUDINARY_API_KEY = set cloudinary api key
   CLOUDINARY_API_SECRET = your cloudinary api secret
   ```
4. Start the server:
   ```sh
   npm run dev
   ```

   ## 🔌 API Endpoints

### 🔐 Authentication
- **POST** `/api/v1/users/register` – Register a new user  
- **POST** `/api/v1/users/login` – Login with email and password  
- **POST** `/api/v1/users/logout` – Logout current user  

### 👤 User
- **GET** `/api/v1/users/profile` – Get logged-in user profile  
- **PATCh** `/api/v1/users/change-details` – Update user details (name, email)
- - **PATCH** `/api/v1/users/change-avatar` – Change avatar
- **PUT** `/api/v1/users/change-password` – Change password
- **POST** `/api/v1/users/refresh` – Refresh Access & Refresh Token   

### 🛍️ Products
- **POST** `/api/v1/products/create` – Create a new product (Admin only)  
- **GET** `/api/v1/products/get-products` – Get all products  
- **GET** `/api/v1/products/get-products/:id` – Get a single product by ID  
- **PATCH** `/api/v1/products/update/:id` – Update product details (Admin only)
- **PATCH** `/api/v1/products/update-image/:id` – Update product image (Admin only)
- **GET** `/api/v1/products/` – Get products using Search, Filter, Sort, Method        
- **DELETE** `/api/v1/products/:id` – Delete a product (Admin only)

### 👤 Customer
- **POST** `/api/v1/customers/register` – Register a new user  
- **POST** `/api/v1/customers/login` – Login with email and password  
- **POST** `/api/v1/customers/logout` – Logout current user  
- **GET** `/api/v1/customers/profile` – Get logged-in user profile  
- **PUT** `/api/v1/customers/change-password` – Change password

### 🛒 Cart
- **POST** `/api/v1/cart/add` – Add item to cart  
- **DELETE** `/api/v1/cart/delete/:productId` – Remove item from cart  
- **GET** `/api/v1/cart/get` – Get all cart items for the Customer  

### 📦 Orders
- **POST** `/api/v1/place-orders` – Place a new order  
- **GET** `/api/v1/orders/get` – Get logged-in user's orders  
- **GET** `/api/v1/orders/admin/orders` – Get All their product order added by Admin

### 📊 Admin Dashboard
- **GET** `/api/v1/admin/stats` – Get total users, products, and orders (Admin only)

### Testing

Use Postman or any API client to test the endpoints.
