# Use Node.js LTS version
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
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