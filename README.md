# TripPlanner AI

## Run backend
cd backend
npm install
copy .env.example .env
npm run dev

Backend: http://localhost:5001
Health: http://localhost:5001/health

## Run frontend
Open a second terminal:
cd frontend
npm install
npm run dev

Open the URL printed by Vite (normally http://localhost:5173).

## Notes
The current project uses the included in-memory datastore. Data is not persistent after server restart. Add MongoDB before production deployment.
