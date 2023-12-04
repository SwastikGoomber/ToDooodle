let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentScore = JSON.parse(localStorage.getItem("currentScore")) || 0;
let targetScore = JSON.parse(localStorage.getItem("targetScore")) || 0;

document.addEventListener("DOMContentLoaded", () => {
  // Load tasks, target score, and current score from local storage on page load
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  targetScore = JSON.parse(localStorage.getItem("targetScore")) || 0;
  currentScore = JSON.parse(localStorage.getItem("currentScore")) || 0;

  // Update the task lists
  updateTaskLists();

  // Display the current score
  const scoreElement = document.getElementById("score");
  scoreElement.textContent = currentScore;

  // Display the target score message
  updateTargetScoreMessage();
});

function addTask() {
  const taskInput = document.getElementById("task");
  const difficultyInput = document.getElementById("difficulty");

  const task = {
    name: taskInput.value,
    difficulty: difficultyInput.value,
    completed: false,
  };

  tasks.push(task);
  updateTaskLists();
  saveToLocalStorage();
}

function updateTaskLists() {
  const easyTasksList = document.getElementById("easyTasks");
  const mediumTasksList = document.getElementById("mediumTasks");
  const hardTasksList = document.getElementById("hardTasks");
  const completedTaskList = document.getElementById("completedTaskList");

  // Clear existing lists
  easyTasksList.innerHTML = "";
  mediumTasksList.innerHTML = "";
  hardTasksList.innerHTML = "";
  completedTaskList.innerHTML = "";

  // Sort tasks by difficulty
  tasks.sort((a, b) => {
    const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
    return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
  });

  // Populate the lists based on difficulty
  tasks.forEach((task) => {
    const taskItem = document.createElement("li");

    // Create a div to hold task details
    const taskDetailsDiv = document.createElement("div");
    taskDetailsDiv.style = `display:flex; width:100%; justify-content: space-between;`;
    // Display task name
    const taskNameSpan = document.createElement("span");
    taskNameSpan.textContent = task.name;
    taskDetailsDiv.appendChild(taskNameSpan);

    const btnDiv = document.createElement("div");
    taskDetailsDiv.appendChild(btnDiv);

    // Add an "Edit Task" button only for incomplete tasks with a pencil icon
    if (!task.completed) {
      const editButton = document.createElement("button");
      editButton.innerHTML = '<i class="fa-solid fa-pencil"></i>'; // Unicode for a pencil icon
      editButton.style.background = "none"; // Remove background color
      editButton.style.border = "none"; // Remove border
      editButton.style.cursor = "pointer";
      editButton.onclick = () => editTaskName(task);
      btnDiv.appendChild(editButton);
    }

    // Add a "Mark as Completed" button next to each incomplete task with a green tick mark
    if (!task.completed) {
      const markButton = document.createElement("button");
      markButton.innerHTML = '<i class="fa-regular fa-circle-check"></i>'; // Unicode for a green tick mark
      markButton.style.background = "none"; // Remove background color
      markButton.style.border = "none"; // Remove border
      markButton.style.cursor = "pointer";
      markButton.onclick = () => completeTask(task);
      btnDiv.appendChild(markButton);
    }

    // Add a "Delete Task" button next to each task with a red trashcan
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-xmark"></i>';
    deleteButton.style.background = "none"; // Remove background color
    deleteButton.style.border = "none"; // Remove border
    deleteButton.style.cursor = "pointer";
    deleteButton.onclick = () => deleteTask(task);
    btnDiv.appendChild(deleteButton);

    taskItem.appendChild(taskDetailsDiv);

    if (task.completed) {
      completedTaskList.appendChild(taskItem);
    } else {
      switch (task.difficulty) {
        case "easy":
          easyTasksList.appendChild(taskItem);
          break;
        case "medium":
          mediumTasksList.appendChild(taskItem);
          break;
        case "hard":
          hardTasksList.appendChild(taskItem);
          break;
      }
    }
  });

  // Save tasks, current score, and target score to local storage after updating
  saveToLocalStorage();
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("targetScore", JSON.stringify(targetScore));
  localStorage.setItem("currentScore", JSON.stringify(currentScore));
}

function completeTask(task) {
  if (!task.completed) {
    updateScore(task.difficulty);
    task.completed = true;

    const scoreElement = document.getElementById("score");
    scoreElement.textContent = currentScore;

    // Update the task lists
    updateTaskLists();

    // Update target score message
    updateTargetScoreMessage();
  }
  // Update local storage when a task is completed
  saveToLocalStorage();
}

function deleteTask(task) {
  tasks = tasks.filter((t) => t !== task);
  updateTaskLists();

  // Update local storage when a task is deleted
  saveToLocalStorage();
}

function editTaskName(task) {
  const newTaskName = prompt("Enter the new task name:", task.name);
  if (newTaskName !== null) {
    task.name = newTaskName;
    updateTaskLists();
    saveToLocalStorage();
  }
}

function updateScore(difficulty) {
  switch (difficulty) {
    case "easy":
      currentScore += 1;
      break;
    case "medium":
      currentScore += 2;
      break;
    case "hard":
      currentScore += 3;
      break;
  }

  // Update local storage when the score is updated
  saveToLocalStorage();
}

function setTargetScore() {
  const targetInput = document.getElementById("targetScore");
  targetScore = parseInt(targetInput.value);

  // Update target score message
  updateTargetScoreMessage();

  // Update local storage when target score is set
  saveToLocalStorage();
}

function updateTargetScoreMessage() {
  const targetMessage = document.getElementById("targetScoreMessage");

  if (targetScore > 0) {
    if (currentScore >= targetScore) {
      targetMessage.textContent = `Congratulations! You've reached your target score!.`;
    } else {
      targetMessage.textContent = `Keep going! Your target score is ${targetScore}.`;
    }
  } else {
    targetMessage.textContent = "";
  }
}

// Add event listener for resetting points
document.getElementById("resetPoints").addEventListener("click", () => {
  resetPoints();
});

// Function to reset points
function resetPoints() {
  currentScore = 0;

  // Update the score display
  const scoreElement = document.getElementById("score");
  scoreElement.textContent = currentScore;

  // Update target score message
  updateTargetScoreMessage();

  // Update local storage when points are reset
  saveToLocalStorage();
}
