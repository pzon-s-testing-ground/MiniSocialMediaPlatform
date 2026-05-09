#!/bin/bash

# Terminal 1 — backend
cd server && npm run dev &

# Terminal 2 — frontend 1
cd client && npm run dev -- --port 5173 &

# Terminal 3 — frontend 2
cd client && npm run dev -- --port 5174 &

wait