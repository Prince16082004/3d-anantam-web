# Deployment Guide for 3D Anantam Web

## Project Overview
This is a full-stack MERN application with:
- **Frontend**: React + Vite with Three.js for 3D components
- **Backend**: Express.js server with SQLite database
- **Features**: User authentication, product management, Razorpay payments

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

## Local Development Setup
```bash
# Frontend
cd "3D Anantam Web"
npm install
npm run dev

# Backend (in separate terminal)
cd server
npm install
npm start
```

## Production Deployment

### 1. Build for Production
```bash
cd "3D Anantam Web"
npm run build
```

### 2. Configure Environment Variables
Copy and configure the production environment file:
```bash
cd server
cp .env.production .env
```

Update the following variables in `.env`:
- `JWT_SECRET`: Generate a strong, unique secret key
- `RAZORPAY_KEY_ID`: Your Razorpay production key ID
- `RAZORPAY_KEY_SECRET`: Your Razorpay production key secret
- `CORS_ORIGIN`: Your deployed domain (e.g., https://yourdomain.com)

### 3. Deploy Options

#### Option A: Vercel (Recommended for Frontend)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

#### Option B: DigitalOcean/AWS/Traditional Hosting
1. Install Node.js on your server
2. Clone your repository
3. Install dependencies:
   ```bash
   cd "3D Anantam Web"
   npm install
   cd ../server
   npm install
   ```
4. Build the frontend:
   ```bash
   cd "3D Anantam Web"
   npm run build
   ```
5. Start the server:
   ```bash
   cd server
   npm start
   ```

#### Option C: Docker Deployment
Create a `Dockerfile` in the root directory:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy frontend
COPY "3D Anantam Web/package*.json" "./3D Anantam Web/"
COPY "3D Anantam Web" "./3D Anantam Web/"

# Copy server
COPY server/package*.json ./server/
COPY server ./server/

# Install dependencies
RUN cd "3D Anantam Web" && npm install
RUN cd server && npm install

# Build frontend
RUN cd "3D Anantam Web" && npm run build

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "server/index.js"]
```

Build and run:
```bash
docker build -t 3d-anantam-web .
docker run -p 5000:5000 3d-anantam-web
```

### 4. Process Management (PM2)
Install PM2 for production:
```bash
npm install -g pm2
```

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: '3d-anantam-web',
    script: 'server/index.js',
    cwd: './',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 5. Nginx Configuration (Optional)
If using Nginx as reverse proxy:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Important Notes
- The SQLite database will be created automatically in the `server` directory
- Ensure proper backups of the SQLite database file (`anantam.db`)
- Uploads are stored in `server/uploads` directory
- The built frontend is served from the `dist` directory
- All API routes are prefixed with `/api`

## Security Considerations
- Change the default JWT secret in production
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Regular security updates for dependencies
- Proper file upload validation and restrictions

## Monitoring
- Use PM2 monitoring: `pm2 monit`
- Check logs: `pm2 logs`
- Monitor server resources and performance

## Troubleshooting
- Check if all dependencies are installed
- Verify environment variables are set correctly
- Ensure ports are not blocked by firewall
- Check server logs for error messages
- Verify database permissions and accessibility
