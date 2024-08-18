# Start with a base image that has Java and Maven installed
FROM maven:3.8.1-jdk-11 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the source code to the container
COPY . .

# Build the application using Maven
RUN mvn clean package

# Use a lightweight base image for the runtime environment
FROM openjdk:11-jre-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the built JAR file from the previous stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port that the application listens to
EXPOSE 8083

# Command to run the application
CMD ["java", "-jar", "app.jar"]
