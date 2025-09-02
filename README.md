# Employee Management System

## Overview

The Employee Management System is a full-stack application built with a React frontend and a Node.js/Express backend. It uses MongoDB for data storage and Redis for caching and session management.

## Features

- User authentication with JWT
- Role-based access control
- Employee management
- Data caching with Redis
- RESTful API

## Prerequisites

- **Node.js**: Ensure you have Node.js installed. Recommended version: `v18.x`.
- **MongoDB**: A running MongoDB instance.
- **Redis**: A running Redis server.

## Setup Instructions

### Backend

1. **Navigate to the backend directory**:
   ```bash
   cd employee-mangement-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the backend directory with the following content:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=your_redis_password_if_any
   ```

4. **Start the backend server**:
   ```bash
   npm run dev
   ```

### Frontend

1. **Navigate to the frontend directory**:
   ```bash
   cd employee-mangement-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the frontend directory with the following content:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   ```

4. **Start the frontend server**:
   ```bash
   npm start
   ```

## API Routes

### Authentication

- **POST** `/api/auth/register`: Register a new user
- **POST** `/api/auth/login`: Login a user
- **POST** `/api/auth/logout`: Logout a user

### User Management

- **GET** `/api/user`: Get all users (Manager/HR only)
- **GET** `/api/user/me`: Get logged-in user data
- **PUT** `/api/user/role`: Update user role (Manager/HR only)

### Employee Management

- **GET** `/api/employee`: Get all employees
- **POST** `/api/employee`: Add a new employee
- **PUT** `/api/employee/:id`: Update employee details
- **DELETE** `/api/employee/:id`: Delete an employee

## Redis Usage

Redis is used for caching frequently accessed data and managing user sessions. It helps improve the performance and scalability of the application.
