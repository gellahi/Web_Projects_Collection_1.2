let tasks = [];
let idCounter = 1;
const taskName = document.getElementById("taskName");
const taskPriority = document.getElementById("taskPriority");
const addTaskButton = document.getElementById("addTaskButton");
const searchInput = document.getElementById("searchInput");
const taskCount = document.getElementById("taskCount");
const darkModeButton = document.getElementById("darkModeButton");

const highList = document.getElementById("highList");
const mediumList = document.getElementById("mediumList");
const lowList = document.getElementById("lowList");
const completedList = document.getElementById("completedList");
const board = document.getElementById("board");

addTaskButton.addEventListener("click", () => {
    if (!taskName.value.trim()) return;
    addTask(taskName.value.trim(), taskPriority.value);
    taskName.value = "";
});

function addTask(name, priority) {
    tasks.push({
        id: idCounter++,
        name: name,
        priority: priority,
        completed: false
    });
    renderTasks();
}

function renderTasks() {
    highList.innerHTML = "";
    mediumList.innerHTML = "";
    lowList.innerHTML = "";
    completedList.innerHTML = "";

    const filteredTasks = tasks.filter(t => {
        const searchVal = searchInput.value.toLowerCase();
        return t.name.toLowerCase().includes(searchVal);
    });

    filteredTasks.forEach(task => {
        const card = document.createElement("div");
        card.className = "taskCard";
        card.draggable = true;
        card.dataset.id = task.id;

        const title = document.createElement("div");
        title.className = "taskTitle";
        title.textContent = task.name;

        if (!task.completed) {
            const actionContainer = document.createElement("div");
            actionContainer.className = "taskActions";

            const completeBtn = document.createElement("button");
            completeBtn.className = "actionButton completeButton";
            completeBtn.textContent = "Complete";
            completeBtn.dataset.action = "complete";
            completeBtn.dataset.id = task.id;

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "actionButton deleteButton";
            deleteBtn.textContent = "Delete";
            deleteBtn.dataset.action = "delete";
            deleteBtn.dataset.id = task.id;

            actionContainer.appendChild(completeBtn);
            actionContainer.appendChild(deleteBtn);

            card.appendChild(title);
            card.appendChild(actionContainer);
        } else {
            card.appendChild(title);
        }

        if (task.completed) {
            completedList.appendChild(card);
        } else {
            if (task.priority === "High") highList.appendChild(card);
            if (task.priority === "Medium") mediumList.appendChild(card);
            if (task.priority === "Low") lowList.appendChild(card);
        }
    });

    updateTaskCount();
}

function updateTaskCount() {
    const incompleteCount = tasks.reduce((count, t) => !t.completed ? count + 1 : count, 0);
    taskCount.textContent = `Incomplete Tasks: ${incompleteCount}`;
}

board.addEventListener("click", (e) => {
    const action = e.target.dataset.action;
    const id = parseInt(e.target.dataset.id);
    if (!action || !id) return;

    if (action === "complete") {
        const taskIndex = tasks.findIndex(t => t.id === id);
        if (taskIndex > -1) {
            tasks[taskIndex].completed = true;
            renderTasks();
        }
    } else if (action === "delete") {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
    }
});

let draggedTaskId = null;

board.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("taskCard")) {
        draggedTaskId = parseInt(e.target.dataset.id);
    }
});

board.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (e.target.classList.contains("taskList")) {
        e.target.classList.add("dragOver");
    }
});

board.addEventListener("dragleave", (e) => {
    if (e.target.classList.contains("taskList")) {
        e.target.classList.remove("dragOver");
    }
});

board.addEventListener("drop", (e) => {
    if (e.target.classList.contains("taskList")) {
        e.preventDefault();
        e.target.classList.remove("dragOver");
        const listId = e.target.id;
        const columnType = listId.replace("List", "");
        const taskIndex = tasks.findIndex(t => t.id === draggedTaskId);
        if (taskIndex > -1) {
            if (columnType === "completed") {
                tasks[taskIndex].completed = true;
            } else {
                tasks[taskIndex].completed = false;
                if (columnType === "high") tasks[taskIndex].priority = "High";
                if (columnType === "medium") tasks[taskIndex].priority = "Medium";
                if (columnType === "low") tasks[taskIndex].priority = "Low";
            }
            renderTasks();
        }
    }
});

searchInput.addEventListener("input", () => {
    renderTasks();
});

darkModeButton.addEventListener("click", () => {
    document.body.classList.toggle("darkMode");
});