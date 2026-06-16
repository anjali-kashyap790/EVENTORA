FROM node:20-alpine

WORKDIR /app

# Copy dependency configuration files
COPY package*.json ./

# Install dependencies (including devDependencies needed for Vite build/run)
RUN npm install

# Copy application files
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Run the Vite development server, binding to 0.0.0.0
CMD ["npm", "run", "dev", "--", "--host"]
