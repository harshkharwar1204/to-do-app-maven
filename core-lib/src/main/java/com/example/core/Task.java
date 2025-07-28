package com.example.core;

import jakarta.validation.constraints.NotBlank;

/**
 * Represents a single To-Do task.
 * This is our core domain model.
 */
public class Task {

    private long id;

    @NotBlank(message = "Task title cannot be empty")
    private String title;

    private boolean completed;

    // Constructors
    public Task() {}

    public Task(long id, String title, boolean completed) {
        this.id = id;
        this.title = title;
        this.completed = completed;
    }

    // Getters and Setters
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}
