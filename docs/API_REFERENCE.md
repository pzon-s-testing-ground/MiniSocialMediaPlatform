# API Reference

Base URL: `http://localhost:5000/api`

## Authentication (`/api/auth`)
- `POST /register`: Create a new user
- `POST /login`: Authenticate and get JWT
- `GET /me`: Get current logged in user details

## Users (`/api/users`)
- `GET /:id`: Get user profile
- `PUT /me`: Update current user profile
- `PUT /:id/follow`: Toggle follow status for a user

## Posts (`/api/posts`)
- `GET /`: Get all posts (threads)
- `GET /:id`: Get specific post by ID
- `GET /user/:userId`: Get all posts by a specific user
- `POST /`: Create a new post
- `DELETE /:id`: Delete a post
- `PUT /:id/like`: Toggle like status on a post

## Comments (`/api/comments`)
- `GET /:postId`: Get all comments for a post
- `POST /:postId`: Add a comment to a post
- `DELETE /:id`: Delete a comment

## Notifications (`/api/notifications`)
- `GET /`: Get all notifications for current user
- `PUT /read`: Mark all notifications as read
