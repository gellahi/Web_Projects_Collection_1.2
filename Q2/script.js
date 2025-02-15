document.addEventListener("DOMContentLoaded", () => {
  let tasks = []
  let idCounter = 1
  let draggedTaskId = null

  const board = document.getElementById("board")
  const boardHeader = document.querySelector(".boardHeader")

  boardHeader.addEventListener("click", (e) => {
    const target = e.target

    if (target.id === "addTaskButton") {
      const taskName = document.getElementById("taskName")
      const taskPriority = document.getElementById("taskPriority")

      if (!taskName.value.trim()) return
      addTask(taskName.value.trim(), taskPriority.value)
      taskName.value = ""
    }
  })

  document.getElementById("darkModeButton").addEventListener("click", () => {
    document.body.classList.toggle("darkMode");
    const darkModeIcon = document.getElementById("darkModeIcon");
    darkModeIcon.classList.add("rotate");
    setTimeout(() => {
      if (document.body.classList.contains("darkMode")) {
        darkModeIcon.classList.remove("fa-moon");
        darkModeIcon.classList.add("fa-sun");
      } else {
        darkModeIcon.classList.remove("fa-sun");
        darkModeIcon.classList.add("fa-moon");
      }
      darkModeIcon.classList.remove("rotate");
    }, 250);
  });

  boardHeader.addEventListener("input", (e) => {
    const target = e.target
    if (target.id === "searchInput" || target.id === "filterPriority") {
      renderTasks()
    }
  })

  board.addEventListener("click", (e) => {
    const target = e.target
    const action = target.dataset.action
    const id = Number.parseInt(target.dataset.id)

    if (!action || !id) return

    if (action === "complete") {
      const taskIndex = tasks.findIndex((t) => t.id === id)
      if (taskIndex > -1) {
        tasks[taskIndex].completed = true
        renderTasks()
      }
    } else if (action === "delete") {
      tasks = tasks.filter((t) => t.id !== id)
      renderTasks()
    }
  })

  board.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("taskCard")) {
      draggedTaskId = Number.parseInt(e.target.dataset.id)
    }
  })

  board.addEventListener("dragover", (e) => {
    if (e.target.classList.contains("taskList") || e.target.classList.contains("column")) {
      e.preventDefault()
      const taskList = e.target.classList.contains("taskList") ? e.target : e.target.querySelector(".taskList")
      taskList.classList.add("dragOver")
    }
  })

  board.addEventListener("dragleave", (e) => {
    if (e.target.classList.contains("taskList") || e.target.classList.contains("column")) {
      const taskList = e.target.classList.contains("taskList") ? e.target : e.target.querySelector(".taskList")
      taskList.classList.remove("dragOver")
    }
  })

  board.addEventListener("drop", (e) => {
    if (e.target.classList.contains("taskList") || e.target.classList.contains("column")) {
      e.preventDefault()
      const taskList = e.target.classList.contains("taskList") ? e.target : e.target.querySelector(".taskList")
      taskList.classList.remove("dragOver")
      handleDrop(taskList.id)
    }
  })

  function handleDrop(listId) {
    const columnType = listId.replace("List", "")
    const taskIndex = tasks.findIndex((t) => t.id === draggedTaskId)

    if (taskIndex > -1) {
      if (columnType === "completed") {
        tasks[taskIndex].completed = true
      } else {
        tasks[taskIndex].completed = false
        tasks[taskIndex].priority = columnType.charAt(0).toUpperCase() + columnType.slice(1)
      }
      draggedTaskId = null
      renderTasks()
    }
  }

  function addTask(name, priority) {
    tasks.push({
      id: idCounter++,
      name: name,
      priority: priority,
      completed: false,
    })
    renderTasks()
  }

  function renderTasks() {
    const lists = {
      high: document.getElementById("highList"),
      medium: document.getElementById("mediumList"),
      low: document.getElementById("lowList"),
      completed: document.getElementById("completedList"),
    }

    Object.values(lists).forEach((list) => (list.innerHTML = ""))

    const searchVal = document.getElementById("searchInput").value.toLowerCase()
    const filterVal = document.getElementById("filterPriority").value

    const filteredTasks = tasks.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(searchVal)
      const matchesFilter = filterVal === "All" || t.priority === filterVal
      return matchesSearch && matchesFilter
    })

    filteredTasks.forEach((task) => {
      const card = createTaskCard(task)

      if (task.completed) {
        lists.completed.appendChild(card)
      } else {
        lists[task.priority.toLowerCase()].appendChild(card)
      }
    })

    updateTaskCount()
  }

  function createTaskCard(task) {
    const card = document.createElement("div")
    card.className = "taskCard"
    card.draggable = true
    card.dataset.id = task.id

    const title = document.createElement("div")
    title.className = "taskTitle"
    title.textContent = task.name

    card.appendChild(title)

    if (!task.completed) {
      const actionContainer = document.createElement("div")
      actionContainer.className = "taskActions"

      const completeBtn = document.createElement("button")
      completeBtn.className = "actionButton completeButton"
      completeBtn.textContent = "Complete"
      completeBtn.dataset.action = "complete"
      completeBtn.dataset.id = task.id

      const deleteBtn = document.createElement("button")
      deleteBtn.className = "actionButton deleteButton"
      deleteBtn.textContent = "Delete"
      deleteBtn.dataset.action = "delete"
      deleteBtn.dataset.id = task.id

      actionContainer.appendChild(completeBtn)
      actionContainer.appendChild(deleteBtn)
      card.appendChild(actionContainer)
    }

    return card
  }

  function updateTaskCount() {
    const incompleteCount = tasks.reduce((count, t) => (!t.completed ? count + 1 : count), 0)
    document.getElementById("taskCount").textContent = `Incomplete Tasks: ${incompleteCount}`
  }
})

