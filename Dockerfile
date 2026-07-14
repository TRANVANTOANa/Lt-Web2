FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/DoAnWeb2-0.0.1-SNAPSHOT.jar app.jar
# Copy the existing uploads folder so current demo images are bundled in the container
COPY --from=build /app/uploads /app/uploads
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]

