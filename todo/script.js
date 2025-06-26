const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const dueInput = document.getElementById('task-due');
const taskList = document.getElementById('task-list');

// Load tasks from localStorage on page load
window.addEventListener('DOMContentLoaded', loadTasksFromStorage);

// Handle form submission
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const taskText = input.value.trim();
  const dueTime = dueInput.value;

  if (taskText === '') return;

  const task = {
    text: taskText,
    createdAt: new Date().toISOString(),
    due: dueTime || null,
    completed: false
  };

  addTaskToDOM(task);
  saveTaskToStorage(task);

  input.value = '';
  dueInput.value = '';
});

// Add a task to the DOM
function addTaskToDOM(task) {
  const li = document.createElement('li');
  li.className = 'task-item';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-check';
  checkbox.checked = task.completed;

  const span = document.createElement('span');
  span.className = 'task-text';
  span.textContent = task.text;
  if (task.completed) {
    span.classList.add('completed');
  }

  const dates = document.createElement('div');
  dates.className = 'task-dates';

  const created = new Date(task.createdAt).toLocaleString();
  dates.innerHTML = `<small>Created: ${created}</small>`;

  if (task.due) {
    const due = new Date(task.due).toLocaleString();
    dates.innerHTML += `<br><small>Complete by: ${due}</small>`;
  }

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = '❌';

  // Event: Mark complete/incomplete
  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked;
    span.classList.toggle('completed', task.completed);
    updateTaskInStorage(task.text, task.completed);
  });

  // Event: Delete task
  deleteBtn.addEventListener('click', () => {
    taskList.removeChild(li);
    deleteTaskFromStorage(task.text);
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(dates);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

// Save task to localStorage
function saveTaskToStorage(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasksFromStorage() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(addTaskToDOM);
}

// Update task completed status in localStorage
function updateTaskInStorage(text, completed) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const task = tasks.find(t => t.text === text);
  if (task) {
    task.completed = completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

// Delete task from localStorage
function deleteTaskFromStorage(text) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.filter(t => t.text !== text);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
