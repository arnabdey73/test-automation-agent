# API Documentation: User Management API

## Base URL
https://api.example.com/v1

## Authentication
All endpoints require authentication using a Bearer token in the Authorization header.

Example:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Endpoints

### Users

#### GET /users
Returns a list of users.

Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Number of results per page (default: 20, max: 100)
- `role`: Filter users by role (optional)

Response:
```json
{
  "data": [
    {
      "id": "12345",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "admin",
      "createdAt": "2025-01-15T10:00:00Z"
    },
    ...
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "pages": 3,
    "limit": 20
  }
}
```

#### GET /users/{id}
Returns details for a specific user.

Path Parameters:
- `id`: User ID

Response:
```json
{
  "id": "12345",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "admin",
  "createdAt": "2025-01-15T10:00:00Z",
  "lastLogin": "2025-06-10T15:30:00Z",
  "settings": {
    "notifications": true,
    "twoFactorAuth": false
  }
}
```

#### POST /users
Creates a new user.

Request Body:
```json
{
  "email": "newuser@example.com",
  "name": "Jane Smith",
  "role": "user",
  "password": "securePassword123"
}
```

Response:
```json
{
  "id": "67890",
  "email": "newuser@example.com",
  "name": "Jane Smith",
  "role": "user",
  "createdAt": "2025-06-15T14:30:00Z"
}
```

#### PUT /users/{id}
Updates a user.

Path Parameters:
- `id`: User ID

Request Body:
```json
{
  "name": "Jane Smith-Johnson",
  "role": "admin"
}
```

Response:
```json
{
  "id": "67890",
  "email": "newuser@example.com",
  "name": "Jane Smith-Johnson",
  "role": "admin",
  "createdAt": "2025-06-15T14:30:00Z",
  "updatedAt": "2025-06-15T15:00:00Z"
}
```

#### DELETE /users/{id}
Deletes a user.

Path Parameters:
- `id`: User ID

Response:
```
204 No Content
```

### Authentication

#### POST /auth/login
Authenticate a user and get an access token.

Request Body:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "user": {
    "id": "12345",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "admin"
  }
}
```

#### POST /auth/refresh
Refresh an expired token.

Request Body:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

## Error Responses

All endpoints may return the following errors:

### 400 Bad Request
Invalid request parameters or body.

```json
{
  "error": "ValidationError",
  "message": "Email is invalid",
  "details": [
    {
      "field": "email",
      "message": "Must be a valid email address"
    }
  ]
}
```

### 401 Unauthorized
Invalid or missing authentication.

```json
{
  "error": "Unauthorized",
  "message": "Invalid token"
}
```

### 403 Forbidden
Insufficient permissions.

```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions to access this resource"
}
```

### 404 Not Found
Resource not found.

```json
{
  "error": "NotFound",
  "message": "User with ID 12345 not found"
}
```

### 500 Internal Server Error
Unexpected server error.

```json
{
  "error": "InternalServerError",
  "message": "An unexpected error occurred"
}
```
