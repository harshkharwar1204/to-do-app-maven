# to-do-app-maven

A simple Todo application built with Java, Spring Boot, and Maven.

## Project Structure

This is a multi-module Maven project consisting of:

- **core-lib**: Contains the core model classes
- **rest-api**: Contains the REST API implementation and UI

## Features

- Create, read, update, and delete tasks
- Mark tasks as completed
- Modern UI with animations and visual feedback
- In-memory storage for simplicity

## Running the Application

```bash
cd rest-api
mvn spring-boot:run
```

The application will be available at http://localhost:8080 or http://localhost:8081

## UI Features

- Responsive design
- Task completion tracking
- Visual feedback for actions
- Empty state handling