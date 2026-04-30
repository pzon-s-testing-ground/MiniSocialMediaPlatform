# MiniSocialMediaPlatform

A retro 2000s forum-style social media platform.

## Features
- Classic forum UI design (Verdana, table-based layouts, beveled buttons)
- User Authentication (Register/Login with JWT)
- Threads (Posts) and Replies (Comments)
- User Profiles and Following system
- Notifications for likes, comments, and follows
- Image upload support

## Installation

1. Clone the repository
2. Install server dependencies: `cd server && npm install`
3. Install client dependencies: `cd client && npm install`
4. Create `.env` in the `server` directory (see API_REFERENCE.md or use defaults)
5. Run MongoDB locally

## Running the App

Start the backend:
```bash
cd server
npm run dev
```

Start the frontend:
```bash
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser.
