# Étape 1 : Build (Compilation)
FROM maven:3.8.7-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# On package l'application en sautant les tests pour gagner du temps lors du build Docker
RUN mvn clean package -DskipTests

# Étape 2 : Run (Exécution)
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# On copie le JAR généré de l'étape précédente
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]