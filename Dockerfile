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

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "server/index.js"]
