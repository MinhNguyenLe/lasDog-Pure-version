let isBlock = false;
let newTodoList = [];

const bodyMain = document.getElementsByTagName("BODY")[0];

function block(items) {
  const linearRandom = Math.floor(Math.random() * 6);
  if (isBlock) {
    bodyMain.innerHTML = `<div class="new-body flex column center mid">
    <div class="frame flex mid column">
      <h1 class="title-new">You still have a to-do list.</h1>
      <p class="joke"> F**k you!!!</p>
      </div>
      <div id="list" class="n-width flex column above"></div>
    </div>`;

    // random background-gradient
    const newBody = document.querySelector(".new-body");
    newBody.classList.add(`linear${linearRandom}`);

    // add work list from extension
    const list = document.getElementById("list");
    items.forEach((item) => {
      if (!item.checked) {
        list.innerHTML += item.new;
      }
    });

    const allInput = document.querySelectorAll(".input-child");
    allInput.forEach((item) => item.remove());

    const listTodo = document.querySelectorAll(".list-todo");
    let count = 1;
    listTodo.forEach((item) => {
      item.innerHTML =
        `<span class="input-child">${count}.</span>` + item.innerHTML;
      count++;
    });
  }
}

// communicate with background page
chrome.runtime.sendMessage({ type: "matchParent" }, (response) => {
  newTodoList = response.state.listTodo;
  if (!response.state.listTodo.length) {
    if (isBlock) {
      isBlock = false;
    }
  } else {
    response.state.listTodo.forEach((item) => {
      if (item.checked == false) isBlock = true;
    });
    if (response.state.listTodo.every((item) => item.checked == true)) {
      if (isBlock) {
        isBlock = false;
      }
    }
  }
  block(response.state.listTodo);
});
