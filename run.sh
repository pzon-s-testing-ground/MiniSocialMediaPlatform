#!/bin/bash

# Terminal 1 — backend
cd server && npm run dev &

# Terminal 2 — frontend
cd client && npm run dev &

wait