const form = document.querySelector("form");
const habitInput = document.getElementById("habit");
const startDateInput = document.getElementById("start-date");
const frequencyInput = document.getElementById("frequency");
const habitList = document.getElementById("habit-picker");
const habitSection = document.getElementById("habit-list");
const detailsSection = document.getElementById("habit-details");

let habits = JSON.parse(localStorage.getItem("habits")) || [];

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function displayHabits() {
  habitList.innerHTML = "";

  if (habits.length > 0) {
    habitSection.style.display = "block";
  }

  habits.forEach((habit, index) => {
    const habitContainer = document.createElement("div");
    habitContainer.classList.add("habit-container");

    const title = document.createElement("p");
    title.textContent = habit.name;

    const viewButton = document.createElement("button");
    viewButton.classList.add("habit-button")
    viewButton.textContent = "Click to View";
    viewButton.onclick = () => showHabitDetails(index);

    habitContainer.appendChild(title);
    habitContainer.appendChild(viewButton);
    habitList.appendChild(habitContainer);
  });
}

function showHabitDetails(index) {
  const habit = habits[index];
  detailsSection.style.display = "block";
  detailsSection.innerHTML = `
    <h3>${habit.name}</h3>
    <p><strong>Start Date:</strong> ${habit.startDate}</p>
    <p><strong>Frequency:</strong> ${habit.frequency}</p>
    <p><strong>Streak:</strong> ${habit.streak} days</p>
    <button onclick="incrementStreak(${index})">Increment Streak</button>
    <button onclick="deleteHabit(${index})">Delete Habit</button>
  `;
}

function incrementStreak(index) {
  habits[index].streak++;
  saveHabits();
  showHabitDetails(index);
}

function deleteHabit(index) {
  habits.splice(index, 1);
  saveHabits();
  displayHabits();
  detailsSection.style.display = "none";
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const habit = {
    name: habitInput.value,
    startDate: startDateInput.value,
    frequency: frequencyInput.value,
    streak: 0,
  };

  habits.push(habit);
  saveHabits();
  displayHabits();

  form.reset();
  detailsSection.style.display = "none";
});

// Load habits on page load
displayHabits();
