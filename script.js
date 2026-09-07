let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];

const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const emptyMessage = document.getElementById("empty-message");
const clearCompletedButton = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll(".filter");

let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.text;

        const editButton = document.createElement("button");
        editButton.className = "edit-btn";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {
            const updatedTask = prompt("Edit your task:", task.text);

            if (updatedTask !== null && updatedTask.trim() !== "") {
                task.text = updatedTask.trim();
                saveTasks();
                renderTasks();
            }
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            renderTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });

    const activeTasks = tasks.filter(task => !task.completed).length;

    taskCount.textContent =
        `${activeTasks} ${activeTasks === 1 ? "task" : "tasks"}`;

    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";
}

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();
}

addButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

filterButtons.forEach(button => {
    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();
    });
});

clearCompletedButton.addEventListener("click", () => {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();

    renderTasks();
});

renderTasks();