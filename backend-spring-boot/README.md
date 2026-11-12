# InterviewMate - Java Spring Boot Backend

This directory contains the Spring Boot backend architecture and MySQL database schema for InterviewMate.

## Tech Stack
- Java 17+
- Spring Boot 3.x
- Spring Data JPA / Hibernate
- Spring Security (JWT Auth)
- MySQL Driver
- Google Gemini API (Spring RestClient / WebClient)

---

## MySQL Setup Instructions

1. Install MySQL Server locally or use a managed database instance.
2. Create the database and tables using `schema.sql`:
   ```bash
   mysql -u root -p < schema.sql
   ```
3. Configure your `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/interviewmate_db?useSSL=false&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   
   gemini.api.key=YOUR_GEMINI_API_KEY
   ```

---

## Running the Spring Boot Application

1. Build with Maven or Gradle:
   ```bash
   mvn clean install
   ```
2. Run the application:
   ```bash
   mvn spring-boot:run
   ```
