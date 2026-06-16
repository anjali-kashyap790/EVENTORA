FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy server code
COPY . .

# Expose server port (configured in .env, typically 5000)
EXPOSE 5000

# Start server
CMD ["npm", "start"]
