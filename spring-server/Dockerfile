# Use a base image with Java runtime environment
FROM eclipse-temurin:17-jdk-focal

# Create a volume to store temporary files and logs
VOLUME /tmp

# Argument for specifying the JAR file
ARG JAR_FILE=target/*.jar

# Copy the executable JAR file from the target directory into the image
COPY ${JAR_FILE} app.jar

# Expose the port that the application will run on
EXPOSE 3000

# Start the application
ENTRYPOINT ["java","-jar","/app.jar"]
