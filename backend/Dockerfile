#
# DevContainer 
#
FROM maven:3.9.12-eclipse-temurin-21-noble AS devel

RUN apt update && apt install -y git

WORKDIR /app

COPY pom.xml /app
RUN mvn dependency:go-offline

COPY src .

# (felix) not sure if we really need this, it just builds the current project and executes it
#RUN mvn clean package

#CMD ["java", "-jar", "target/tour-planner.jar"]

#
# Build stage
#
FROM maven:3.9.12-eclipse-temurin-21-alpine AS build

COPY src /home/app/src
COPY pom.xml /home/app

RUN mvn -f /home/app/pom.xml clean package

#
# release stage
#
FROM eclipse-temurin:21 AS live

COPY --from=build /home/app/target/tour-planner-0.0.1-SNAPSHOT.jar /usr/local/lib/tour-planner.jar

ENTRYPOINT [ "java", "-jar", "/usr/local/lib/tour-planner.jar" ]