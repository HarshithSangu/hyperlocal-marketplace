# Hyperlocal Discovery Platform - Frontend

React frontend for hyperlocal product discovery platform with user search, seller dashboard, and admin panel.

## Features

- **User Authentication**: Register and login with JWT
- **Product Search**: Find products nearby with geolocation
- **Seller Dashboard**: Register shop and add products
- **Admin Panel**: Approve or reject seller applications
- **Protected Routes**: Role-based access control

## Setup

```bash
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` and connects to the backend at `http://localhost:5000`.

## Folder Structure

```
src/
├── context/
│   └── AuthContext.jsx       # JWT auth state management
├── pages/
│   ├── Login.jsx             # Login page
│   ├── Register.jsx          # Registration page
│   ├── Search.jsx            # Product search (main page)
│   ├── Seller.jsx            # Seller dashboard
│   └── Admin.jsx             # Admin panel
├── components/
│   └── ProtectedRoute.jsx    # Role-based route guard
├── styles/
│   ├── Auth.css
│   ├── Search.css
│   ├── Seller.css
│   └── Admin.css
├── api.js                    # API utility with automatic JWT attachment
├── App.jsx                   # Main routing
└── main.jsx                  # Entry point
```

## Endpoints Used

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/search` - Search products (geolocation required)
- `POST /api/sellers/apply` - Apply for shop
- `GET /api/sellers/mine` - Get seller's shop
- `PATCH /api/sellers/:shopId/status` - Admin approve/reject shop
- `POST /api/products/shop` - Add/update product
- `GET /api/products/shop/:shopId` - Get shop products

## How to Use

1. **User Workflow**:
   - Register as a "User" → Login → Search products by location

2. **Seller Workflow**:
   - Register as a "Seller" → Login → Apply for shop → Wait for admin approval → Add products

3. **Admin Workflow**:
   - Login with admin credentials → Approve/Reject pending shops

## Notes

- All API requests automatically include JWT token from localStorage
- Geolocation is required for product search
- Seller must have approved shop before adding products
- Minimal CSS, no external UI libraries used
