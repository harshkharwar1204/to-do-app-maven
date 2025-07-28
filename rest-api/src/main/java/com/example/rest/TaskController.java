package com.example.rest;

import com.example.core.Task;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * REST Controller for managing tasks.
 * Provides CRUD (Create, Read, Update, Delete) operations.
 */
@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "*") // Allow requests from any origin (for simple frontend)
public class TaskController {

    // Using a simple in-memory map as a database for this example.
    private final Map<Long, Task> tasks = new ConcurrentHashMap<>();
    // AtomicLong for generating unique IDs safely.
    private final AtomicLong counter = new AtomicLong();

    // Pre-populate with some data
    public TaskController() {
        long id1 = counter.incrementAndGet();
        tasks.put(id1, new Task(id1, "Build the backend API", true));
        long id2 = counter.incrementAndGet();
        tasks.put(id2, new Task(id2, "Create the frontend UI", false));
    }

    /**
     * GET /tasks
     * @return A collection of all tasks.
     */
    @GetMapping
    public Collection<Task> getAllTasks() {
        return tasks.values();
    }

    /**
     * GET /tasks/{id}
     * @param id The ID of the task to retrieve.
     * @return The task if found, otherwise a 404 Not Found response.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable long id) {
        Task task = tasks.get(id);
        return task != null ? ResponseEntity.ok(task) : ResponseEntity.notFound().build();
    }

    /**
     * POST /tasks
     * @param task The task to create. The @Valid annotation triggers validation.
     * @return The newly created task with its assigned ID.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Task createTask(@Valid @RequestBody Task task) {
        long newId = counter.incrementAndGet();
        task.setId(newId);
        tasks.put(newId, task);
        return task;
    }

    /**
     * PUT /tasks/{id}
     * @param id The ID of the task to update.
     * @param updatedTask The updated task data.
     * @return The updated task if successful, otherwise a 404 Not Found response.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable long id, @Valid @RequestBody Task updatedTask) {
        if (!tasks.containsKey(id)) {
            return ResponseEntity.notFound().build();
        }
        updatedTask.setId(id);
        tasks.put(id, updatedTask);
        return ResponseEntity.ok(updatedTask);
    }

    /**
     * DELETE /tasks/{id}
     * @param id The ID of the task to delete.
     * @return A 204 No Content response if successful, otherwise a 404 Not Found.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable long id) {
        if (tasks.remove(id) == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
