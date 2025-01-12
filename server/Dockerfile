# Development stage
FROM node:18-alpine as development

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies including devDependencies
RUN npm install

# Copy app source
COPY . .

# Expose port
EXPOSE 3001

# Start development server with nodemon
CMD ["npm", "run", "dev"]

# Production stage
FROM node:18-alpine as production

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy app source
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Create volume for uploads
VOLUME ["/usr/src/app/uploads"]

# Expose port
EXPOSE 3001

# Start the server
CMD ["node", "server.js"] 