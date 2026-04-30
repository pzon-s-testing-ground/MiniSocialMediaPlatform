# Architecture

## Overview
The application follows a standard MERN (MongoDB, Express, React, Node.js) stack architecture.

### Client Structure (`/client`)
- `src/api`: Axios instance and API call wrappers
- `src/app`: Redux store configuration
- `src/components`: Reusable UI components (Navbar, CommentBox, PostCard)
- `src/features`: Redux slices for state management
- `src/pages`: Main view components representing routes
- `src/index.css`: Global design system variables and classes

### Server Structure (`/server`)
- `src/config`: Database connection
- `src/controllers`: Business logic for handling requests
- `src/middlewares`: Auth token verification, error handling, file upload
- `src/models`: Mongoose schemas (User, Post, Comment, Notification)
- `src/routes`: Express route definitions mapped to controllers

## Data Flow
1. User interacts with React components
2. Components dispatch Redux thunks or call API directly
3. Axios sends HTTP requests to Express server
4. Express routes request to corresponding controller
5. Controller interacts with MongoDB via Mongoose
6. Response is sent back to Client to update UI/State
