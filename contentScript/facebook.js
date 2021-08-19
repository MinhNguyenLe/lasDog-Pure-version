let isBlock = false;

// document.documentElement.style.display = "none"

const bodyMain = document.getElementsByTagName("BODY")[0];

function block(items, settingBlock) {
  const linearRandom = Math.floor(Math.random() * 6);
  if (isBlock && settingBlock) {
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

    document.documentElement.style.display = "block";
  }
}

chrome.storage.local.get(["state"], function (result) {
  if (!result.state.listTodo.length) {
    if (isBlock) {
      isBlock = false;
    }
  } else {
    result.state.listTodo.forEach((item) => {
      if (item.checked == false) isBlock = true;
    });
    if (result.state.listTodo.every((item) => item.checked == true)) {
      if (isBlock) {
        isBlock = false;
      }
    }
  }
  block(result.state.listTodo, result.state.setting.facebook);
});
