window.oncontextmenu = function () {
  return false; // cancel default menu
};

let state = {
  listTodo: [],
  countId: 0,
};

// list element action
const countdown = document.querySelector(".btn-countdown");
const todoInput = document.getElementById("todo");
const list = document.getElementById("list");
const todo = document.querySelector(".btn-todo");
const startCountdown = document.querySelector(".start-countdown");

// communicate with background page
function communicateBG() {
  chrome.runtime.sendMessage({ type: "action", state }, (response) => {});
  console.log(chrome.runtime);
}
communicateBG();

// list function
function removeItem(t) {
  t.remove();
  state.listTodo = state.listTodo.filter((list) => list.id != t.id);
  chrome.storage.local.set({ state }, function () {});
  communicateBG();
}

function handleChecked(t) {
  state.listTodo.forEach((item) => {
    if (item.checkedId == t.id) {
      item.checked = !item.checked;
    }
  });
  chrome.storage.local.set({ state }, function () {});
  communicateBG();
}

function setOldChecked() {
  document.querySelectorAll(".input-child").forEach((label) => {
    state.listTodo.forEach((item) => {
      if (item.checkedId == label.id) label.checked = item.checked;
    });
  });
}

// get data from local storage
chrome.storage.local.get(["state"], function (result) {
  // show OLD item todo
  if (result.state && result.state.listTodo) {
    result.state.listTodo.forEach((l) => {
      if (l.new) {
        state.listTodo.push(l);
        list.innerHTML += l.new;
        setOldChecked();
      }
    });
  }
  // set begin id value
  if (result.state.countId) state.countId = result.state.countId;

  // handle check OLD item todo
  document.querySelectorAll(".input-child").forEach((label) => {
    label.addEventListener("change", () => handleChecked(label));
  });

  // remove for OLD item todo
  document.querySelectorAll(".list-todo").forEach((t) => {
    t.addEventListener("contextmenu", () => removeItem(t));
  });
  communicateBG();
});

// click countdown tab
countdown.addEventListener("click", () => {
  // change interface
  document.getElementById("table-todo").style.display = "none";
  document.getElementById("table-countdown").style.display = "flex";

  todo.classList.remove("action");
  countdown.classList.add("action");
});

// click todo tab
todo.addEventListener("click", () => {
  // change interface
  document.getElementById("table-todo").style.display = "flex";
  document.getElementById("table-countdown").style.display = "none";

  countdown.classList.remove("action");
  todo.classList.add("action");
});

// input todo
todoInput.addEventListener("keydown", (e) => {
  if (e.code == "Enter") {
    let newTodo = `<div id="${state.countId}" class="list-todo full-width flex row mid">
    <input id="input-${state.countId}" class="input-child" type="checkbox"/>
    <label class="todo-label" for="input-${state.countId}" id="todo-${state.countId}">${todoInput.value}</label>
        </div>`;
    // show NEW item todo
    list.innerHTML += newTodo;

    state.listTodo.push({
      new: newTodo,
      id: state.countId,
      checkedId: `input-${state.countId}`,
      checked: false,
    });

    // handle check NEW item todo
    document.querySelectorAll(".input-child").forEach((label) => {
      label.addEventListener("change", () => handleChecked(label));
    });

    //remove for NEW item todo
    document.querySelectorAll(".list-todo").forEach((t) => {
      t.addEventListener("contextmenu", () => removeItem(t));
    });

    // create new id item todo
    state.countId = state.countId + 1;

    // reset value from todo input
    todoInput.value = "";
    setOldChecked();

    communicateBG();
    // add data to local storage
    chrome.storage.local.set({ state }, function () {});
  }
});
