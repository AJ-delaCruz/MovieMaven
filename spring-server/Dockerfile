# Stage 1 (Build): Build the app in a Docker container
FROM maven:3.8.1-openjdk-17 as build
WORKDIR /app
COPY . .
RUN mvn clean install

# Stage 2 (Run): Run the app in a Docker container
FROM eclipse-temurin:17-jdk-focal
WORKDIR /app
COPY --from=build /app/target/*.jar /app.jar

# Expose the port that the application will run on
EXPOSE 3000

# Start the application
ENTRYPOINT ["java","-jar","/app.jar"]
