FROM node:20-alpine
# Set the working directory
WORKDIR /7sales-nuxt-app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Build your Nuxt 3 application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run your app
CMD [ "npm", "start" ]
