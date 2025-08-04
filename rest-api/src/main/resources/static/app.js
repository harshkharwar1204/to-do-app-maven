// The base URL for our REST API
const API_URL = "http://localhost:8082/tasks";

// DOM elements
const taskList = document.getElementById("task-list");
const addTaskForm = document.getElementById("add-task-form");
const taskTitleInput = document.getElementById("task-title");
const tasksCountElement = document.getElementById("tasks-count");
const completedCountElement = document.getElementById("completed-count");

function showNotification(message, isError = false) {
  const notification = document.getElementById("notification");
  notification.innerHTML = isError ? 
    `<i class="fas fa-exclamation-circle"></i> ${message}` : 
    `<i class="fas fa-check-circle"></i> ${message}`;
  notification.style.background = isError ? "#ff6b6b" : "#667eea";
  notification.style.display = "block";
  notification.style.opacity = "1";
  
  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => {
      notification.style.display = "none";
    }, 300);
  }, 2000);
}

/**
 * Fetches all tasks from the API and renders them.
 */
async function fetchAndRenderTasks() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Network response was not ok");
    const tasks = await response.json();

    taskList.innerHTML = ""; // Clear the list before rendering

    // Update task counts
    const completedTasks = tasks.filter(task => task.completed);
    tasksCountElement.textContent = `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`;
    completedCountElement.textContent = `${completedTasks.length} completed`;

    if (tasks.length === 0) {
      taskList.innerHTML = `
        <li class="empty-state">
          <i class="fas fa-clipboard-list empty-icon"></i>
          <p>No tasks yet. Add your first task!</p>
        </li>
      `;
      return;
    }

    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.dataset.id = task.id;
      li.className = task.completed ? "completed" : "";

      li.innerHTML = `
                <span>${task.title}</span>
                <div class="actions">
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                </div>
            `;

      // Event listener for toggling completion status
      li.querySelector("span").addEventListener("click", () =>
        toggleTaskCompletion(task)
      );

      // Event listener for the delete button
      li.querySelector(".delete-btn").addEventListener("click", () =>
        deleteTask(task.id)
      );

      taskList.appendChild(li);
    });
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    taskList.innerHTML = "<li>Error loading tasks.</li>";
    showNotification("Failed to load tasks", true);
  }
}

/**
 * Handles the form submission to add a new task.
 */
addTaskForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = taskTitleInput.value.trim();
  if (!title) return;

  const newTask = { title, completed: false };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });
    if (!response.ok) throw new Error("Failed to create task");

    taskTitleInput.value = ""; // Clear input field
    fetchAndRenderTasks(); // Re-fetch all tasks to show the new one
    showNotification("Task added!");
  } catch (error) {
    console.error("Error adding task:", error);
    showNotification("Failed to add task", true);
  }
});

/**
 * Toggles the completion status of a task.
 */
async function toggleTaskCompletion(task) {
  const updatedTask = { ...task, completed: !task.completed };

  try {
    const response = await fetch(`${API_URL}/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });
    if (!response.ok) throw new Error("Failed to update task");

    fetchAndRenderTasks(); // Refresh the list
    showNotification(
      updatedTask.completed ? "Task completed!" : "Task marked as incomplete!"
    );
  } catch (error) {
    console.error("Error updating task:", error);
    showNotification("Failed to update task", true);
  }
}

/**
 * Deletes a task by its ID.
 */
async function deleteTask(id) {
  // Animate the task being removed
  const taskElement = document.querySelector(`li[data-id="${id}"]`);
  if (taskElement) {
    taskElement.style.opacity = "0";
    taskElement.style.transform = "translateX(30px)";
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete task");

    // Wait for animation to complete before refreshing the list
    setTimeout(() => {
      fetchAndRenderTasks(); // Refresh the list
    }, 300);
    
    showNotification("Task deleted!");
  } catch (error) {
    console.error("Error deleting task:", error);
    showNotification("Failed to delete task", true);
    // Reset the animation if there was an error
    if (taskElement) {
      taskElement.style.opacity = "1";
      taskElement.style.transform = "translateX(0)";
    }
  }
}

// Initial load of tasks when the page loads
document.addEventListener("DOMContentLoaded", fetchAndRenderTasks);
