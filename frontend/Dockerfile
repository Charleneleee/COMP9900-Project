# Use official Node image, version 16.19.0
FROM node:16.19.0-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json from the current directory to the working directory
COPY package.json package-lock.json ./

# Install dependencies using npm
RUN npm ci

# Copy the contents of the current directory to the working directory
COPY . /app

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]