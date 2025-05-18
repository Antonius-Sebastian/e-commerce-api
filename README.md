# Express E-Commerce API

A robust RESTful API for e-commerce applications built with TypeScript, Express, and PostgreSQL.

## 📋 Table of Contents

-   [Express E-Commerce API](#express-e-commerce-api)
    -   [📋 Table of Contents](#-table-of-contents)
    -   [✨ Features](#-features)
    -   [🛠️ Tech Stack](#️-tech-stack)
    -   [📋 Prerequisites](#-prerequisites)
    -   [🚀 Installation](#-installation)
    -   [🔐 Environment Variables](#-environment-variables)
    -   [📂 Project Structure](#-project-structure)
    -   [📚 API Documentation](#-api-documentation)
        -   [API Endpoints](#api-endpoints)
            -   [Authentication](#authentication)
            -   [Products](#products)
            -   [Product Variants](#product-variants)
            -   [Users](#users)
            -   [Categories](#categories)
            -   [Orders](#orders)
    -   [🔒 Authentication](#-authentication)
    -   [💾 Database](#-database)
    -   [📁 File Uploads](#-file-uploads)
    -   [📄 License](#-license)

## ✨ Features

-   **User Management**: Authentication, authorization, and user CRUD operations
-   **Product Management**: Products with variants, categories, and image uploads
-   **Order Processing**: Complete order lifecycle from creation to delivery
-   **Role-Based Access Control**: Different permissions for admin and regular users
-   **Data Validation**: Comprehensive validation with Zod
-   **API Documentation**: Auto-generated Swagger documentation
-   **File Uploads**: Image upload with Google Cloud Storage integration

## 🛠️ Tech Stack

-   **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [TypeScript](https://www.typescriptlang.org/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/), [Prisma ORM](https://www.prisma.io/)
-   **Authentication**: [JWT](https://jwt.io/), [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
-   **Validation**: [Zod](https://github.com/colinhacks/zod)
-   **API Documentation**: [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express), [Zod to OpenAPI](https://github.com/asteasolutions/zod-to-openapi)
-   **Logging**: [Morgan](https://github.com/expressjs/morgan)
-   **File Storage**: [Multer](https://github.com/expressjs/multer), [Google Cloud Storage](https://cloud.google.com/storage)

## 📋 Prerequisites

-   Node.js (v16.x or later)
-   PostgreSQL (v14.x or later)
-   Google Cloud Platform account (for file storage)

## 🚀 Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Antonius-Sebastian/e-commerce-api.git
    cd store-api
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up your environment variables (see [Environment Variables](#environment-variables))

4. Set up the database:

    ```bash
    npx prisma migrate deploy
    ```

5. Seed the database (optional):

    ```bash
    npx prisma db seed
    ```

6. Start the development server:

    ```bash
    npm run dev
    ```

7. Build for production:
    ```bash
    npm run build
    ```

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/store

# JWT Authentication
JWT_SECRET=your_jwt_secret_key

# Google Cloud Storage
GCP_PROJECT_ID=your_gcp_project_id
```

## 📂 Project Structure

```
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── config/
│   │   └── index.ts
│   ├── constants/
│   │   ├── error-constants.ts
│   │   └── index.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── category.controller.ts
│   │   ├── index.ts
│   │   ├── order.controller.ts
│   │   ├── product.controller.ts
│   │   └── user.controller.ts
│   ├── interfaces/
│   │   └── index.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── index.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── category.routes.ts
│   │   ├── index.ts
│   │   ├── order.routes.ts
│   │   ├── product.routes.ts
│   │   └── user.routes.ts
│   ├── schemas/
│   │   ├── auth.schema.ts
│   │   ├── category.schema.ts
│   │   ├── error.schema.ts
│   │   ├── index.ts
│   │   ├── order.schema.ts
│   │   ├── product.schema.ts
│   │   └── user.schema.ts
│   ├── utils/
│   │   ├── ApiError.ts
│   │   ├── createError.ts
│   │   └── uploadImage.ts
│   ├── app.ts
│   ├── index.ts
│   └── tsconfig.json
├── tests/
├── .env
├── .gitignore
├── package.json
├── openapi-docs.json
├── package-lock.json
├── README.md
└── tsconfig.json
```

## 📚 API Documentation

API documentation is automatically generated using Zod to OpenAPI conversion and Swagger UI. The API uses `@asteasolutions/zod-to-openapi` to transform Zod schemas into OpenAPI specifications. Once the server is running, you can access the documentation at:

```
http://localhost:{PORT}/api-docs
```

### API Endpoints

#### Authentication

-   `POST /api/auth/sign-up`: Register a new user
-   `POST /api/auth/sign-in`: Authenticate user and get token

#### Products

-   `GET /api/products`: List all products
-   `POST /api/products`: Create a product (admin only)
-   `GET /api/products/:product_id`: Get single product by ID
-   `PUT /api/products/:product_id`: Update product (admin only)
-   `DELETE /api/products/:product_id`: Delete a product (admin only)

#### Product Variants

-   `POST /api/products/:product_id/variants`: Add product variant (admin only)
-   `PUT /api/products/variants/:variant_id`: Update product variant (admin only)
-   `DELETE /api/products/variants/:variant_id`: Delete product variant (admin only)

#### Users

-   `GET /api/users`: Get all users (admin only)
-   `POST /api/users`: Create a new user (admin only)
-   `GET /api/users/search?query=`: Search users (admin only)
-   `GET /api/users/:user_id`: Get a user by ID
-   `PUT /api/users/:user_id`: Update user
-   `DELETE /api/users/:user_id`: Delete user

#### Categories

-   `GET /api/categories`: List all categories
-   `POST /api/categories`: Create a new category (admin only)
-   `GET /api/categories/:category_id`: Get a category by ID
-   `PUT /api/categories/:category_id`: Update a category (admin only)
-   `DELETE /api/categories/:category_id`: Delete a category (admin only)

#### Orders

-   `GET /api/orders`: Get all orders (admin only)
-   `POST /api/orders`: Create a new order
-   `GET /api/orders/:order_id`: Get order by ID
-   `PUT /api/orders/:order_id`: Update order status (admin only)
-   `DELETE /api/orders/:order_id`: Delete an order (admin only)
-   `GET /api/orders/user/:user_id`: Get orders for a user (admin only)
-   `PUT /api/orders/:order_id/cancel`: Cancel an order

## 🔒 Authentication

This API uses JWT (JSON Web Tokens) for authentication. To access protected endpoints:

1. Get a token by signing in through the `/api/auth/sign-in` endpoint
2. Include the token in the Authorization header of subsequent requests:
    ```
    Authorization: Bearer <your_token>
    ```

## 💾 Database

The API uses PostgreSQL as the database with Prisma ORM for database operations. The database schema includes the following main entities:

-   Users
-   Products
-   Product Variants
-   Categories
-   Orders
-   Order Items

## 📁 File Uploads

The API supports file uploads for product images using:

-   **Multer**: For handling multipart/form-data
-   **Google Cloud Storage**: For storing uploaded files

To upload an image, use a multipart form request to the appropriate endpoint with the file in the 'image' field.

``

## 📄 License

This project is licensed under the MIT License.
