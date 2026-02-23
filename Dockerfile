FROM maven:3.9.12-eclipse-temurin-25-noble AS devel

RUN apt update && apt install -y git

WORKDIR /app

COPY pom.xml /app
RUN mvn dependency:go-offline

COPY . .
RUN mvn clean package

CMD ["java", "-jar", "target/tour-planner.jar"]