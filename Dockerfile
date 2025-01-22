# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json, package-lock.json, and tsconfig.json to the container
COPY package*.json tsconfig.json ./

# Install dependencies
RUN npm install

# Install TypeScript globally for compiling TypeScript code
RUN npm install -g typescript

# Copy the rest of the application code to the container
COPY src ./src

# Compile TypeScript to JavaScript
RUN tsc

# Remove devDependencies after build
RUN npm prune --production

# Move into the dist folder for runtime
WORKDIR /usr/src/app/dist

# Expose the port your app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["node", "app.js"]