# Ecommerce-API

A REST API for an online e-commerce system built with Node.js, Express, PostgreSQL, and Redis.

## Features

- Token-based Authentication and Authorization
- Scalable Shopping Cart using Redis
- Refresh Tokens for Security
- Product Listing and Management
- Order Placement and Management
- Email Notifications
- Payment Integration
- File Upload (Avatars)
- Custom Error Handling
- Full-Text Search
- Database Transactions
- Server-Side Pagination
- Schema Validation
- API Rate Limiting
- API Caching
- Dependency Injection
- Swagger API Documentation

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT
- **Validation**: zod
- **File Upload**: Multer
- **Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- Redis
- npm or yarn

## Installation

1. Clone the repository:

```
git clone https://github.com/yourusername/green-basket.git
cd green-basket
```

2. Install dependencies:

```
npm install
# or
yarn install
```

3. Set up environment variables:
- Copy `.env.example` to `.env`
- Update the values in `.env` with your own settings (e.g., database URL, JWT secrets, email config)

4. Set up the database:
- Ensure PostgreSQL is running
- Run migrations/seeds if available (check `src/db_temp.ts` or similar)

## Usage

### Development

- `npm start`: Start the server
- `npm run dev`: Start in development mode with nodemon
- `npm test`: Run tests (if configured)

### API Documentation

Access Swagger docs at: `http://localhost:2000/api-docs`

### Key Endpoints

- **Auth**: `/api/auth/login`, `/api/auth/register`
- **Products**: `/api/products`
- **Profile**: `/api/profile`
- **Orders**: `/api/orders`
- **Admin**: `/api/admin` (requires admin role)

## Environment Variables

Create a `.env` file with:

```
PORT=2000
JWT_SECRET=your_jwt_secret
POSTGRES_URL=your_postgres_url
REDIS_URL=your_redis_url
EMAIL_CONFIG=your_email_config
```

## Scripts

- `npm start`: Start the server
- `npm run dev`: Start in development mode with nodemon
- `npm test`: Run tests (if configured)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.
