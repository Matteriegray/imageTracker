# Backend Server

## Setup

1. Copy `backend/.env.example` to `backend/.env`.
2. Update `MONGO_URI` and `JWT_SECRET`.
3. Run `npm install` from the `backend` folder.
4. Start the server with `npm run dev`.

## Available routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/cases`
- `POST /api/cases`
- `GET /api/cases/:id`

## Environment variables

- `PORT` - backend port
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - secret used to sign auth tokens
- `NODE_ENV` - environment mode
