# ShopEase - Simple E-Commerce Store

A full-stack e-commerce web application built with Node.js, Express, MongoDB, and vanilla JavaScript. This project was created for the CodeAlpha Full Stack Development Internship.

## Features

### Customer Features
- Browse products with search, filter by category, and sort by price
- View detailed product information
- Add products to shopping cart
- Manage cart (add, remove, update quantities)
- User registration and login with JWT authentication
- Secure checkout with shipping information
- Order placement with "Cash on Delivery" and "Demo Payment" options
- View order history and order details
- User profile management

### Admin Features
- Admin dashboard with statistics (total products, users, orders, sales)
- Product management (add, edit, delete products)
- Order management (view all orders, update order status)
- User management (view all registered users)

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens) for authentication
- bcryptjs for password hashing

### Frontend
- HTML5
- CSS3 (Custom, no frameworks)
- Vanilla JavaScript (No React, Angular, Vue, or jQuery)

## Project Structure

```
ecommerce-store/
├── frontend/
│   ├── index.html
│   ├── products.html
│   ├── product-details.html
│   ├── cart.html
│   ├── checkout.html
│   ├── login.html
│   ├── register.html
│   ├── profile.html
│   ├── orders.html
│   ├── order-success.html
│   │
│   ├── admin/
│   │   ├── dashboard.html
│   │   ├── products.html
│   │   ├── orders.html
│   │   └── users.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       ├── api.js
│       ├── auth.js
│       ├── products.js
│       ├── product-details.js
│       ├── cart.js
│       ├── checkout.js
│       ├── orders.js
│       └── admin.js
│
├── backend/
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── userRoutes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   ├── seed/
│   │   └── seedProducts.js
│   ├── .env
│   └── package.json
│
├── README.md
└── .gitignore
```

## MongoDB Setup

1. Install MongoDB on your system or use MongoDB Atlas (cloud)
2. Create a database named `ecommerce-store`
3. Note your MongoDB connection string

## Environment Variables

Create a `.env` file in the `backend` folder with the following:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce-store
JWT_SECRET=your_secret_key_here_change_this_in_production
```

For MongoDB Atlas, use:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce-store
```

## Installation Steps

### 1. Clone or download the project

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Seed Products and Create Admin User

```bash
npm run seed
```

This will:
- Clear existing products
- Insert 12 sample products
- Create an admin user (if not exists)

**Default Admin Credentials:**
- Email: `admin@example.com`
- Password: `admin123`

> **Important:** Change these credentials in production!

### 4. Start the Backend Server

```bash
npm run dev
```

The server will run on `http://localhost:5000`

### 5. Access the Application

Open your browser and go to:
```
http://localhost:5000
```

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get current user profile | Yes |

### Products
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all products (with search, filter, sort) | No |
| GET | `/api/products/:id` | Get product by ID | No |
| POST | `/api/products` | Create a new product | Yes (Admin) |
| PUT | `/api/products/:id` | Update a product | Yes (Admin) |
| DELETE | `/api/products/:id` | Delete a product | Yes (Admin) |

### Orders
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/orders` | Create a new order | Yes |
| GET | `/api/orders/my-orders` | Get current user's orders | Yes |
| GET | `/api/orders/:id` | Get order by ID | Yes |
| GET | `/api/orders` | Get all orders | Yes (Admin) |
| PUT | `/api/orders/:id/status` | Update order status | Yes (Admin) |

### Users
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users` | Get all users | Yes (Admin) |
| GET | `/api/users/:id` | Get user by ID | Yes (Admin) |

## Database Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date
}
```

### Product Model
```javascript
{
  name: String (required),
  description: String (required),
  price: Number (required),
  category: String (required, enum: ['Electronics', 'Fashion', 'Accessories', 'Home', 'Books']),
  image: String (required),
  stock: Number (required, default: 0),
  rating: Number (default: 0, min: 0, max: 5),
  numReviews: Number (default: 0),
  createdAt: Date
}
```

### Order Model
```javascript
{
  user: ObjectId (ref: User, required),
  orderItems: [{
    product: ObjectId (ref: Product),
    name: String,
    image: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: Number (required),
  shippingAddress: {
    street: String (required),
    city: String (required),
    state: String (required),
    zipCode: String (required),
    country: String (required)
  },
  phone: String (required),
  paymentMethod: String (enum: ['Cash on Delivery', 'Demo Payment'], default: 'Cash on Delivery'),
  status: String (enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending'),
  deliveredAt: Date,
  createdAt: Date
}
```

## Testing the Application

### Test User Workflow
1. Open `http://localhost:5000`
2. Browse products on the homepage
3. Use search and filters to find products
4. Click "View Details" on a product
5. Add products to cart
6. Go to cart and adjust quantities
7. Proceed to checkout
8. Register a new account or login
9. Complete checkout with shipping information
10. View order confirmation
11. Check "My Orders" in profile

### Test Admin Workflow
1. Login with `admin@example.com` / `admin123`
2. Access admin panel from navigation
3. View dashboard statistics
4. Add/edit/delete products
5. View and manage orders
6. Update order statuses
7. View all users

## Common Errors and Solutions

### MongoDB Connection Error
- Ensure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use
- Change the `PORT` in `.env` file
- Or stop the process using port 5000

### Products Not Loading
- Run `npm run seed` to populate the database
- Check that MongoDB is connected

### Login Not Working
- Ensure you registered first
- Check that the backend server is running
- Check browser console for errors

### Cart Not Persisting
- Cart is stored in localStorage
- Clear browser cache if issues persist

## Future Improvements

- Product reviews and ratings system
- Wishlist functionality
- Product image upload
- Advanced search with filters
- Email notifications for orders
- Payment gateway integration
- Product categories management
- Discount codes and coupons
- Order tracking
- User address book
- Product recommendations

## License

MIT License - Built for CodeAlpha Internship

## Author

CodeAlpha Intern - Full Stack Development
#   S i m p l e - E - c o m m e r c e - S t o r e  
 #   S i m p l e - E - c o m m e r c e - S t o r e  
 #   S i m p l e - E - c o m m e r c e - S t o r e  
 #   S i m p l e - E - c o m m e r c e - S t o r e  
 #   S i m p l e - E - c o m m e r c e - S t o r e  
 