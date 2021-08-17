let countId = 0;

const countdown = document.querySelector(".btn-countdown");

countdown.addEventListener("click", () => {
  document.getElementById("table-todo").style.display = "none";

  todo.classList.remove("action");
  countdown.classList.add("action");
});

const todo = document.querySelector(".btn-todo");

todo.addEventListener("click", () => {
  document.getElementById("table-todo").style.display = "flex";

  countdown.classList.remove("action");
  todo.classList.add("action");
});

const todoInput = document.getElementById("todo");
const list = document.getElementById("list");
todoInput.addEventListener("keydown", (e) => {
  if (e.code == "Enter") {
    list.innerHTML += `<div class="list-todo full-width flex row mid">
    <input id="${countId}" type="checkbox" />
    <label class="todo-label" for="${countId}" id="todo-${countId}">${todoInput.value}</label>
        </div>`;
    countId++;
    todoInput.value = "";
  }
});
