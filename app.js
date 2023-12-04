let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentScore = JSON.parse(localStorage.getItem("currentScore")) || 0;
let targetScore = JSON.parse(localStorage.getItem("targetScore")) || 0;

document.addEventListener("DOMContentLoaded", () => {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  targetScore = JSON.parse(localStorage.getItem("targetScore")) || 0;
  currentScore = JSON.parse(localStorage.getItem("currentScore")) || 0;

  updateTaskLists();

  const scoreElement = document.getElementById("score");
  scoreElement.textContent = currentScore;

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

    // div to hold task details
    const taskDetailsDiv = document.createElement("div");
    taskDetailsDiv.style = `display:flex; width:100%; justify-content: space-between;`;
    // Display task name
    const taskNameSpan = document.createElement("span");
    taskNameSpan.textContent = task.name;
    taskDetailsDiv.appendChild(taskNameSpan);

    const btnDiv = document.createElement("div");
    taskDetailsDiv.appendChild(btnDiv);

    //"Edit Task" button
    if (!task.completed) {
      const editButton = document.createElement("button");
      editButton.innerHTML = '<i class="fa-solid fa-pencil"></i>';
      editButton.style.background = "none";
      editButton.style.border = "none";
      editButton.style.cursor = "pointer";
      editButton.onclick = () => editTaskName(task);
      btnDiv.appendChild(editButton);
    }

    //"Mark as Completed" button
    if (!task.completed) {
      const markButton = document.createElement("button");
      markButton.innerHTML = '<i class="fa-regular fa-circle-check"></i>';
      markButton.style.background = "none";
      markButton.style.border = "none";
      markButton.style.cursor = "pointer";
      markButton.onclick = () => completeTask(task);
      btnDiv.appendChild(markButton);
    }

    //"Delete Task" button
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-xmark"></i>';
    deleteButton.style.background = "none";
    deleteButton.style.border = "none";
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

    updateTaskLists();

    updateTargetScoreMessage();
  }
  saveToLocalStorage();
}

function deleteTask(task) {
  tasks = tasks.filter((t) => t !== task);
  updateTaskLists();

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
  saveToLocalStorage();
}

function setTargetScore() {
  const targetInput = document.getElementById("targetScore");
  targetScore = parseInt(targetInput.value);

  updateTargetScoreMessage();

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

//event listener for resetting points
document.getElementById("resetPoints").addEventListener("click", () => {
  resetPoints();
});

function resetPoints() {
  currentScore = 0;

  const scoreElement = document.getElementById("score");
  scoreElement.textContent = currentScore;

  updateTargetScoreMessage();

  saveToLocalStorage();
}
