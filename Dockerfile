FROM node:18-alpine

WORKDIR /app

# Copy backend files
COPY src/backend/ .

# Install dependencies
RUN npm install --production

# Expose port
EXPOSE 5000

# Create database directory
RUN mkdir -p ./database

# Start server
CMD ["node", "server.js"]
