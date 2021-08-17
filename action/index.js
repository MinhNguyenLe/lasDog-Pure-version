window.oncontextmenu = function () {
  return false; // cancel default menu
};

let state = {
  listTodo: [],
  countId: 0,
};
let isNew = false;

const countdown = document.querySelector(".btn-countdown");
const todoInput = document.getElementById("todo");
const list = document.getElementById("list");
const todo = document.querySelector(".btn-todo");
const startCountdown = document.querySelector(".start-countdown");

function removeItem(t) {
  t.remove();
  state.listTodo = state.listTodo.filter((list) => list.id != t.id);
  chrome.storage.local.set({ state }, function () {});
}

chrome.storage.local.get(["state"], function (result) {
  if (result.state && result.state.listTodo) {
    result.state.listTodo.forEach((l) => {
      if (l.new) {
        state.listTodo.push(l);
        list.innerHTML += l.new;
      }
    });
  }
  if (result.state.countId) state.countId = result.state.countId;
  document.querySelectorAll(".list-todo").forEach((t) => {
    console.log(t);
    t.addEventListener("contextmenu", () => removeItem(t));
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
    let newTodo = `<div id="${state.countId}" class="list-todo full-width flex row mid">
    <input id="input-${state.countId}" class="input-child" type="checkbox"/>
    <label class="todo-label" for="input-${state.countId}" id="todo-${state.countId}">${todoInput.value}</label>
        </div>`;

    state.listTodo.push({
      new: newTodo,
      id: state.countId,
    });

    list.innerHTML += newTodo;

    document.querySelectorAll(".list-todo").forEach((t) => {
      t.addEventListener("contextmenu", () => removeItem(t));
    });

    state.countId = state.countId + 1;

    todoInput.value = "";

    chrome.storage.local.set({ state }, function () {});
  }
});
