document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
});

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

document.getElementById("task-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("task-name").value;
    const description = document.getElementById("task-desc").value;
    const status = document.getElementById("task-status").value;

    if (!name || !description) return;

    const task = { id: Date.now(), name, description, status };

    // Add task to localStorage
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();
    document.getElementById("task-form").reset();
});

function loadTasks() {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    renderTasks();
}

function renderTasks() {
    const pendingTasks = tasks.filter(task => task.status === "Pending");
    const completedTasks = tasks.filter(task => task.status === "Completed");

    renderTaskList(pendingTasks, "task-list-pending");
    renderTaskList(completedTasks, "task-list-completed");
}

function renderTaskList(tasks, listId) {
    const taskList = document.getElementById(listId);
    taskList.innerHTML = ''; // Clear the table before rendering the tasks again

    tasks.forEach((task) => {
        const row = document.createElement("tr");

        // Render the status as a dropdown for Pending tasks, and text for Completed tasks
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
            <td><button class="delete" onclick="deleteTask(${task.id})">Delete</button></td>
        `;
        
        taskList.appendChild(row);
    });
}

function updateStatus(id, status) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.status = status;
        // Update in localStorage
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}
