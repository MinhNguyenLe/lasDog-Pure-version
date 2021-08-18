let isBlock = false;
let newTodoList = [];

const bodyMain = document.getElementsByTagName("BODY")[0];

function block(items) {
  const linearRandom = Math.floor(Math.random() * 7);
  if (isBlock) {
    bodyMain.innerHTML = `<div class="new-body flex column center mid">
      <h1 class="title-new">You still work list to do. Fighting!!!</h1>
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
