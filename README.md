# E-Commerce Inventory API

A robust RESTful API for e-commerce inventory management built with NestJS, TypeScript, and PostgreSQL. This API provides secure CRUD operations for products and categories with JWT-based authentication.

##  Live Demo

- **API Base URL**: https://inventra-api-a54o.onrender.com
- **API Documentation**: https://inventra-api-a54o.onrender.com/api/docs
- **Database**: PostgreSQL hosted on neon

## 🛠️ Tech Stack

- **Backend**: Node.js with NestJS & TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger/OpenAPI
- **Architecture**: Domain-Driven Design (DDD) with Repository pattern
- **Validation**: Class-validator with DTOs
- **Hosting**: Render (Backend) + Neon (Database)

## 📋 Features

### Authentication
- ✅ User registration with email, username, and hashed password
- ✅ User login with JWT token generation
- ✅ JWT-based authorization for protected endpoints
- ✅ Password hashing with bcrypt

### Product Management
- ✅ Create products with name, description, price, stock, category, and optional image
- ✅ List products with advanced filtering:
  - Filter by category
  - Filter by price range (min/max)
  - Pagination support
- ✅ Get single product by ID with category details
- ✅ Update product information
- ✅ Delete products
- ✅ Search products by name or description
- ✅ Comprehensive error handling (404, 400, etc.)

### Category Management
- ✅ Create categories with unique names
- ✅ List all categories with product counts
- ✅ Get single category by ID
- ✅ Update category information
- ✅ Delete categories (only if no linked products)
- ✅ Prevent deletion of categories with existing products

### Additional Features
- ✅ Swagger API documentation with examples
- ✅ Input validation and sanitization
- ✅ CORS enabled for frontend integration
- ✅ Global exception handling
- ✅ TypeScript for type safety
- ✅ Clean, maintainable code following SOLID principles

##  Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (or use Neon)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/parvajio/inventra.git
   cd inventra
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/inventra"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=3000
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run start:dev
   ```

6. **Access the API**
   - API: http://localhost:3000
   - Documentation: http://localhost:3000/api/docs

### Production Deployment

The application is already deployed on Render with the following configuration:

1. **Backend**: Deployed on Render
   - URL: https://inventra-api-a54o.onrender.com
   - Auto-deploys from main branch
   - Environment variables configured on Render dashboard

2. **Database**: PostgreSQL on Neon
   - Managed PostgreSQL database
   - Connection string configured in production environment

##  API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Product Endpoints

#### Create Product
```http
POST /api/products
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "description": "Latest iPhone with advanced features",
  "price": 999.99,
  "stock": 50,
  "imageUrl": "https://example.com/image.jpg",
  "categoryId": "clx1234567890abcdef"
}
```

#### Get All Products (with filters)
```http
GET /api/products?categoryId=clx123&minPrice=100&maxPrice=1000&page=1&limit=10
Authorization: Bearer <jwt-token>
```

#### Search Products
```http
GET /api/products/search?q=iPhone
Authorization: Bearer <jwt-token>
```

#### Get Single Product
```http
GET /api/products/{id}
Authorization: Bearer <jwt-token>
```

#### Update Product
```http
PATCH /api/products/{id}
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Updated Product Name",
  "price": 899.99
}
```

#### Delete Product
```http
DELETE /api/products/{id}
Authorization: Bearer <jwt-token>
```

### Category Endpoints

#### Create Category
```http
POST /api/categories
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices and accessories"
}
```

#### Get All Categories
```http
GET /api/categories
Authorization: Bearer <jwt-token>
```

#### Get Single Category
```http
GET /api/categories/{id}
Authorization: Bearer <jwt-token>
```

#### Update Category
```http
PATCH /api/categories/{id}
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Updated Category Name",
  "description": "Updated description"
}
```

#### Delete Category
```http
DELETE /api/categories/{id}
Authorization: Bearer <jwt-token>
```

##  Database Schema

### Users Table
- `id`: Primary key (CUID)
- `email`: Unique email address
- `username`: Unique username
- `password`: Hashed password
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Categories Table
- `id`: Primary key (CUID)
- `name`: Unique category name
- `description`: Optional description
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Products Table
- `id`: Primary key (CUID)
- `name`: Product name
- `description`: Optional description
- `price`: Decimal price (10,2)
- `stock`: Integer stock count
- `imageUrl`: Optional image URL
- `categoryId`: Foreign key to categories
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

##  Development

### Project Structure
```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data Transfer Objects
│   ├── strategies/      # JWT strategy and guards
│   └── *.ts            # Auth controller and service
├── categories/          # Categories module
│   ├── dto/            # Category DTOs
│   └── *.ts           # Category controller and service
├── products/           # Products module
│   ├── dto/           # Product DTOs
│   └── *.ts          # Product controller and service
├── database/          # Database module
│   └── *.ts         # Prisma service
└── main.ts           # Application entry point
```

### Available Scripts

```bash
# Development
npm run start:dev      # Start with hot reload
npm run start:debug    # Start with debug mode

# Production
npm run build         # Build the application
npm run start:prod    # Start production server

# Testing
npm run test          # Run unit tests
npm run test:watch    # Run tests in watch mode
npm run test:e2e      # Run e2e tests
npm run test:cov      # Run tests with coverage

# Code Quality
npm run lint          # Run ESLint
npm run format        # Format code with Prettier
```

### Database Commands

```bash
# Generate Prisma client
npx prisma generate

# Create and apply migration
npx prisma migrate dev

# Reset database
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio
```

##  Testing

The API includes comprehensive test coverage:

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

##  API Response Examples

### Successful Product Creation
```json
{
  "id": "clx1234567890abcdef",
  "name": "iPhone 15 Pro",
  "description": "Latest iPhone with advanced features",
  "price": 999.99,
  "stock": 50,
  "imageUrl": "https://example.com/image.jpg",
  "categoryId": "clx1234567890abcdef",
  "createdAt": "2024-01-20T10:30:00.000Z",
  "updatedAt": "2024-01-20T10:30:00.000Z",
  "category": {
    "id": "clx1234567890abcdef",
    "name": "Electronics",
    "description": "Electronic devices and accessories"
  }
}
```

### Paginated Product List
```json
{
  "products": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPage": 5
  }
}
```

### Error Response
```json
{
  "statusCode": 404,
  "message": "Product not found",
  "error": "Not Found"
}
```

##  Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Protected routes with guards
- SQL injection prevention through Prisma ORM

##  Deployment

### Render Deployment
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Configure build command: `npm install && npm run build`
4. Configure start command: `npm run start:prod`
5. Set environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Your JWT secret key
   - `PORT`: 3000 (or let Render assign)

### Database Setup
1. Create a PostgreSQL database on Neon
2. Get the connection string
3. Run migrations: `npx prisma migrate deploy`

##  Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Author

Created by [Your Name] - [GitHub Profile](https://github.com/yourusername)

##  Acknowledgments

- NestJS framework
- Prisma ORM
- PostgreSQL
- Render for hosting
- Neon for database hosting