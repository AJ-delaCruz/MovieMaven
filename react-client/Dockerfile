# Stage 1 - the build stage
FROM node:16 as build-deps

# Create app directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the production dependencies
# installs the exact versions of the dependencies for Continuous Integration
RUN npm ci --only=production

# Copy the rest of the application files to the container
COPY . .

#Build the application
RUN npm run build

# Stage 2 - the production stage
# FROM nginx:1.17.9-alpine
FROM nginx:1.23.2-alpine

#Copy the build directory to the Nginx HTML directory
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html

#Copy the nginx.conf file to the Nginx configuration default.conf file
COPY nginx.conf /etc/nginx/conf.d/default.conf

#Exposes port 80 on the container
EXPOSE 80

#Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
