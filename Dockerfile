# Use the official Node.js image as the base image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Install pnpm and serve
RUN npm install -g pnpm serve

# Install dependencies
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the Vite application
RUN pnpm run build

# Ensure the correct ownership and permissions
RUN chown -R node:node /app

# Switch to the non-root 'node' user
USER node

# Expose the port the app runs on
EXPOSE 8080

# Start the production server
CMD ["serve", "-s", "dist", "-l", "8080"]
