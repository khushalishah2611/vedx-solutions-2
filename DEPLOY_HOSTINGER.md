# Deploying frontend and backend separately on Hostinger

This repository has a Vite/React frontend (`frontend/`) and an Express/Prisma backend (`backend/`). The steps below assume you want to host static assets (frontend) on Hostinger's web hosting and the Node.js API (backend) on a VPS or a Hostinger plan that supports long-running Node processes.

## Backend (Node + Prisma + MySQL)
1. **Prepare the server.**
   - Use a VPS/Cloud plan with SSH access; install Node.js 18+ and npm.
   - Create a MySQL database in hPanel; note the host, port, database name, username, and password.

2. **Upload the backend.**
   - Copy the `backend/` folder to the server or clone the repo, then run `npm ci` inside `backend/` to install dependencies.
   - Create a `.env` file in `backend/` with at least:
     ```
     DATABASE_URL="mysql://<user>:<password>@<host>:<port>/<database>"
     PORT=5000
     NODE_ENV=production
     EMAIL_USER="your-smtp-user"
     EMAIL_PASS="your-smtp-password"
     EMAIL_FROM="no-reply@yourdomain.com"
     ```
     `DATABASE_URL` is required by Prisma, and the email variables are required for OTP mail sending.

3. **Generate and migrate the database.**
   - Run `npm run prisma:generate` to ensure the Prisma client is built.
   - Apply migrations with `npx prisma migrate deploy` (or `npm run prisma:migrate` if you want to create new migrations in a dev environment).

4. **Start the API.**
   - Launch the server with `npm run start` (port defaults to `PORT` or 5000).
   - For production, use a process manager such as PM2: `pm2 start src/server.js --name vedx-api --time`.

5. **Reverse proxy the API.**
   - Configure Nginx/Apache to forward `https://api.yourdomain.com/` (or `https://yourdomain.com/api/`) to `http://127.0.0.1:5000/`.
   - Ensure CORS on the API allows the frontend domain (the server currently enables CORS for all origins).

## Frontend (Vite + React)
1. **Build locally.**
   - From `frontend/`, run `npm ci` then `npm run build`. The static assets will be in `frontend/dist/`.

2. **Upload to Hostinger web hosting.**
   - In hPanel's File Manager or via FTP, upload the contents of `frontend/dist/` into `public_html/` (or a subdirectory if using a subdomain).
   - If using a single-page app with client-side routing, add an `.htaccess` file in `public_html/` with:
     ```
     RewriteEngine On
     RewriteBase /
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
     ```

3. **Connect the frontend to the backend.**
   - The Vite dev setup proxies `/api` to `http://localhost:5000`; in production you should mirror this by pointing `/api` to your backend via the web server (preferred) or by updating the frontend API base URL to the full backend domain.
   - If you proxy `/api` through Nginx/Apache on the frontend host, the browser will call the backend without CORS issues.

## Ongoing maintenance
- Use `pm2 status`/`pm2 logs vedx-api` to monitor the backend.
- Re-deploy frontend changes by rebuilding and uploading the new `dist/` files.
- Back up the MySQL database regularly from hPanel or via `mysqldump`.
