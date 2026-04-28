# 🍕 FoodFlow Ops - Full-Stack Microservices Platform

## Project Overview

**FoodFlow Ops** is a production-grade **food delivery system** built with a modern microservices architecture. It's a complete end-to-end platform featuring real-time order tracking, multi-role dashboards, and event-driven communication.

### What This Project Does

This is a **complete food delivery platform** similar to Uber Eats, DoorDash, or Zomato. It handles:

- **Customer Orders**: Browse restaurants, place orders, track delivery in real-time
- **Restaurant Management**: Accept/reject orders, manage menu, mark orders as ready
- **Delivery Tracking**: Assign riders, track location in real-time, update delivery status
- **Operations Dashboard**: Real-time monitoring of all orders, events, and system metrics
- **Authentication**: Multi-role user system (Customer, Restaurant, Rider, Admin)

---

## 🏗 Architecture

### Microservices Structure

```
FoodFlow Ops
├── API Gateway (Port 8000)
│   └── Entry point for all client requests
│
├── Auth Service (Port 3001)
│   └── User management & JWT authentication
│
├── Order Service (Port 3002)
│   └── Core order processing logic
│
├── Restaurant Service (Port 3003)
│   └── Menu management & order preparation
│
├── Delivery Service (Port 3004)
│   └── Rider assignment & location tracking
│
├── Ops Tracker Service (Port 3005)
│   └── Real-time event consolidation & Socket.IO broadcasting
│
└── Frontend (Port 3000 or 4173)
    └── React dashboard for all user roles
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + Vite + TailwindCSS + Framer Motion + Socket.IO |
| **Backend** | Node.js + Express.js |
| **Messaging** | RabbitMQ (event-driven architecture) |
| **Database** | PostgreSQL (separate DB per service) |
| **DevOps** | Docker + Docker Compose |

---

## 🔄 Order Flow (Event-Driven)

```
1. Customer Places Order
   ↓ (Order Service publishes "order.placed")
   
2. Restaurant Receives Order
   ↓ (Restaurant Service publishes "restaurant.accepted")
   
3. Kitchen Prepares Order
   ↓ (Restaurant Service publishes "restaurant.ready")
   
4. Delivery Service Auto-Assigns Rider
   ↓ (Delivery Service publishes "delivery.assigned")
   
5. Rider Picks Up Order
   ↓ (Delivery Service publishes "delivery.picked_up")
   
6. Rider Out for Delivery
   ↓ (Delivery Service publishes "delivery.out_for_delivery" + location updates)
   
7. Order Delivered
   ↓ (Delivery Service publishes "delivery.delivered")
   
8. Ops Tracker Listens to ALL Events
   ↓ (Broadcasts via Socket.IO to dashboards in real-time)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ (for local development)
- **PostgreSQL** v15+ (database)
- **RabbitMQ** (message broker)
- **Docker & Docker Compose** (for containerized deployment)

### Option 1: Docker Compose (Recommended)

```bash
# Start all services with Docker
docker-compose up --build

# Services will be available at:
# Frontend: http://localhost:3000
# API Gateway: http://localhost:8000
# RabbitMQ Admin: http://localhost:15672 (guest/guest)
```

### Option 2: Local Development (Without Docker)

#### Step 1: Install Dependencies

```bash
# Install all service dependencies
npm install                          # Root (if needed)
npm install --prefix api-gateway
npm install --prefix frontend
npm install --prefix services/auth-service
npm install --prefix services/order-service
npm install --prefix services/restaurant-service
npm install --prefix services/delivery-service
npm install --prefix services/ops-tracker-service
```

#### Step 2: Setup PostgreSQL

```bash
# Create databases
psql -U postgres -c "CREATE DATABASE foodflow_db;"
psql -U postgres -c "CREATE DATABASE auth_db;"
psql -U postgres -c "CREATE DATABASE order_db;"
psql -U postgres -c "CREATE DATABASE restaurant_db;"
psql -U postgres -c "CREATE DATABASE delivery_db;"
psql -U postgres -c "CREATE DATABASE ops_db;"

# Or run the init script
bash init-db.sh
```

#### Step 3: Setup RabbitMQ

```bash
# Install RabbitMQ (macOS)
brew install rabbitmq

# Install RabbitMQ (Ubuntu/Debian)
sudo apt-get install rabbitmq-server

# Start RabbitMQ
rabbitmq-server

# Enable management plugin
sudo rabbitmq-plugins enable rabbitmq_management

# Access at http://localhost:15672 (guest/guest)
```

#### Step 4: Start Services

Open 7 terminal windows and run:

```bash
# Terminal 1: Auth Service
npm start --prefix services/auth-service

# Terminal 2: Order Service
npm start --prefix services/order-service

# Terminal 3: Restaurant Service
npm start --prefix services/restaurant-service

# Terminal 4: Delivery Service
npm start --prefix services/delivery-service

# Terminal 5: Ops Tracker Service
npm start --prefix services/ops-tracker-service

# Terminal 6: API Gateway
npm start --prefix api-gateway

# Terminal 7: Frontend
npm run dev --prefix frontend
```

---

## 🎮 Demo Accounts

All passwords are `123456`

| Role | Email | Dashboard |
|------|-------|-----------|
| **Customer** | `cust@foodflow.com` | Browse restaurants, place orders, track delivery |
| **Restaurant** | `rest@foodflow.com` | Accept orders, manage menu, mark ready |
| **Rider** | `rider@foodflow.com` | View assigned deliveries, update status |
| **Admin** | `admin@foodflow.com` | Real-time ops dashboard, system metrics |

---

## 📁 Project Structure

```
foodflow-ops/
├── api-gateway/                    # API Gateway (Express proxy)
│   ├── index.js
│   └── package.json
│
├── services/
│   ├── auth-service/              # Authentication & User Management
│   ├── order-service/             # Order Processing
│   ├── restaurant-service/        # Restaurant & Menu Management
│   ├── delivery-service/          # Delivery & Rider Management
│   └── ops-tracker-service/       # Real-time Event Tracking
│
├── frontend/                       # React Dashboard
│   ├── src/
│   │   ├── pages/                 # Role-based dashboards
│   │   ├── context/               # Auth context
│   │   └── App.jsx
│   └── package.json
│
├── docker-compose.yml             # Container orchestration
├── init-db.sh                     # Database initialization
├── .env                           # Environment variables
└── README.md
```

---

## 🔑 Key Features

### ✅ Completed Features

- [x] Multi-role authentication (Customer, Restaurant, Rider, Admin)
- [x] Real-time order tracking with Socket.IO
- [x] Event-driven architecture with RabbitMQ
- [x] Restaurant discovery with geolocation
- [x] Order lifecycle management
- [x] Rider assignment & location simulation
- [x] Real-time ops dashboard
- [x] Responsive React UI with TailwindCSS
- [x] Database per service (microservices pattern)
- [x] Docker containerization

### 🚀 Potential Enhancements

- [ ] Payment integration (Stripe/Razorpay)
- [ ] Push notifications
- [ ] Advanced analytics & reporting
- [ ] Machine learning for delivery time prediction
- [ ] Mobile app (React Native)
- [ ] Kubernetes deployment
- [ ] GraphQL API layer
- [ ] Advanced caching (Redis)

---

## 🔧 Environment Variables

The `.env` file contains all configuration:

```env
# Global
PORT=8000
JWT_SECRET=supersecret_change_me_in_production

# Database URLs (PostgreSQL)
DATABASE_URL=postgresql://admin:password@localhost:5432/foodflow_db
AUTH_DB_URL=postgresql://admin:password@localhost:5432/auth_db
ORDER_DB_URL=postgresql://admin:password@localhost:5432/order_db
RESTAURANT_DB_URL=postgresql://admin:password@localhost:5432/restaurant_db
DELIVERY_DB_URL=postgresql://admin:password@localhost:5432/delivery_db
OPS_DB_URL=postgresql://admin:password@localhost:5432/ops_db

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672

# Service URLs (for gateway)
AUTH_SERVICE_URL=http://localhost:3001
ORDER_SERVICE_URL=http://localhost:3002
RESTAURANT_SERVICE_URL=http://localhost:3003
DELIVERY_SERVICE_URL=http://localhost:3004
OPS_SERVICE_URL=http://localhost:3005

# Frontend
VITE_GATEWAY_URL=http://localhost:8000
VITE_SOCKET_URL=http://localhost:3005
```

---

## 📊 API Endpoints

### Auth Service (Port 3001)
```
POST   /register              - Register new user
POST   /login                 - Login & get JWT token
GET    /me                    - Get current user profile
```

### Order Service (Port 3002)
```
POST   /                      - Place new order
GET    /:id                   - Get order details
GET    /customer/:customerId  - Get customer's orders
PATCH  /:id/status            - Update order status
```

### Restaurant Service (Port 3003)
```
GET    /nearby                - Find nearby restaurants
POST   /discover              - Discover restaurants from map data
GET    /:id/menu              - Get restaurant menu
GET    /:id/orders            - Get restaurant's orders
POST   /orders/:orderId/accept - Accept order
POST   /orders/:orderId/ready  - Mark order ready
```

### Delivery Service (Port 3004)
```
GET    /rider/:riderId        - Get rider's deliveries
POST   /:orderId/status       - Update delivery status
```

### Ops Tracker Service (Port 3005)
```
GET    /live-orders           - Get all live orders
GET    /timeline/:orderId     - Get order event timeline
GET    /stats                 - Get system statistics
WS     (Socket.IO)            - Real-time updates
```

---

## 🐛 Troubleshooting

### Issue: "RabbitMQ connection failed"
**Solution**: Ensure RabbitMQ is running
```bash
# Check if running
sudo systemctl status rabbitmq-server

# Start if not running
sudo systemctl start rabbitmq-server
```

### Issue: "Database connection refused"
**Solution**: Ensure PostgreSQL is running and databases exist
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Create databases if missing
bash init-db.sh
```

### Issue: "Port already in use"
**Solution**: Change port in `.env` or kill existing process
```bash
# Find process using port 8000
lsof -i :8000

# Kill process
kill -9 <PID>
```

### Issue: "ENOSPC: System limit for number of file watchers"
**Solution**: Increase file watcher limit
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

## 📝 Issues Fixed

✅ **SQL Injection Vulnerability** - Fixed parameterized queries in auth-service seeding
✅ **SQL Injection Vulnerability** - Fixed parameterized queries in restaurant-service seeding
✅ **Missing Environment Variables** - Created `.env` file from `.env.example`
✅ **Missing Dependencies** - Installed all npm packages for all services
✅ **File Watcher Limits** - Increased system limits for development

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review the README.md
3. Check service logs for errors
4. Verify all prerequisites are installed

---

**Happy Coding! 🚀**
