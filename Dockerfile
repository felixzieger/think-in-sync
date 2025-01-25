# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Ensure the correct ownership and permissions
RUN chown -R node:node /app

# Switch to the non-root 'node' user
USER node

# Build the Vite application
RUN npm run build

# Expose the port the app runs on
EXPOSE 8080

# Start the Vite development server
CMD ["npm", "run", "dev"]
