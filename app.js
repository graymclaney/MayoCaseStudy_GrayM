document.addEventListener("DOMContentLoaded", () => {
    loadTasks(); // Initial load of task list
    setInterval(loadTasks, 5000); // Auto-refresh the task list every 5 seconds
});

const API_URL = "http://localhost:8000/tasks";

// Handles task form submission
document.getElementById("task-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("task-name").value;
    const description = document.getElementById("task-desc").value;
    const status = document.getElementById("task-status").value;

    if (!name || !description) return;

    const task = { name, description, status };

    // Send new task to backend
    await fetch(`${API_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
    });

    document.getElementById("task-form").reset();
    loadTasks(); // Refresh task list after submission
});

// Fetches all tasks from the backend
async function loadTasks() {
    const response = await fetch(`${API_URL}/`);
    const tasks = await response.json();
    renderTasks(tasks); // Renders tasks in table
}

// Separates tasks by status and displays them
function renderTasks(tasks) {
    const pendingTasks = tasks.filter(task => task.status === "Pending");
    const completedTasks = tasks.filter(task => task.status === "Completed");

    renderTaskList(pendingTasks, "task-list-pending");
    renderTaskList(completedTasks, "task-list-completed");
}

// Renders a list of tasks into a specific table section
function renderTaskList(tasks, listId) {
    const taskList = document.getElementById(listId);
    taskList.innerHTML = ''; 

    tasks.forEach((task) => {
        const row = document.createElement("tr");

        const statusCell = task.status === "Completed"
            ? `<td>${task.status}</td>`
            : `<td>
                <select onchange="updateStatus(${task.id}, this.value)">
                    <option value="Pending" ${task.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                </select>
            </td>`;

        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.description}</td>
            ${statusCell}
            <td>
                <button onclick="editTask(${task.id})">Edit</button>
                <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
            </td>
        `;

        taskList.appendChild(row);
    });
}

async function editTask(id) {
    const tasks = await fetch(`${API_URL}/`).then(res => res.json());
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newName = prompt("Edit Task Name:", task.name);
    if (newName === null) return; 
    const newDesc = prompt("Edit Task Description:", task.description);
    if (newDesc === null) return; 
    const updatedTask = {
        name: newName.trim(),
        description: newDesc.trim(),
        status: task.status
    };

    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask)
    });

    loadTasks();
}


// Updates task status in the backend
async function updateStatus(id, status) {
    // Find the specific task by ID from the current task list
    const task = await fetch(`${API_URL}/`)
        .then(res => res.json())
        .then(tasks => tasks.find(t => t.id === id));
        
    if (!task) return;

    task.status = status;

    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task)
    });

    loadTasks(); // Refresh task list after update
}

// Deletes a task by ID
async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    loadTasks(); // Refresh task list after deletion
}
