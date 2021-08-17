window.oncontextmenu = function () {
  return false; // cancel default menu
};

let state = {
  listTodo: [],
};

let countId = 0;

const countdown = document.querySelector(".btn-countdown");
const todoInput = document.getElementById("todo");
const list = document.getElementById("list");
const todo = document.querySelector(".btn-todo");
const startCountdown = document.querySelector(".start-countdown");

chrome.storage.local.get(["listTodo"], function (result) {
  if (result.listTodo) {
    result.listTodo.forEach((l) => {
      list.innerHTML += l;
    });
  }
  document.querySelectorAll(".list-todo").forEach((t) => {
    t.addEventListener("contextmenu", () => {
      t.remove();
      return false;
    });
  });
});

countdown.addEventListener("click", () => {
  document.getElementById("table-todo").style.display = "none";
  document.getElementById("table-countdown").style.display = "flex";

  todo.classList.remove("action");
  countdown.classList.add("action");
});

todo.addEventListener("click", () => {
  document.getElementById("table-todo").style.display = "flex";
  document.getElementById("table-countdown").style.display = "none";

  countdown.classList.remove("action");
  todo.classList.add("action");
});

todoInput.addEventListener("keydown", (e) => {
  if (e.code == "Enter") {
    let newTodo = `<div class="list-todo full-width flex row mid">
    <input id="${countId}" class="input-child" type="checkbox"/>
    <label class="todo-label" for="${countId}" id="todo-${countId}">${todoInput.value}</label>
        </div>`;

    state.listTodo.push(newTodo);

    list.innerHTML += newTodo;

    const todoChild = document.querySelectorAll(".list-todo");
    todoChild.forEach((t) => {
      t.addEventListener("contextmenu", () => {
        t.remove();
        return false;
      });
    });

    chrome.storage.local.set({ listTodo: state.listTodo }, function () {});

    countId++;
    todoInput.value = "";
  }
});
