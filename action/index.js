let itemTodo = `<div class="full-width flex row center mid">
          <input id="" type="checkbox" />
          <label for="" id="">aaa</label>
        </div>`;
let countId = 0;

const countdown = document.querySelector(".btn-countdown");
countdown.addEventListener("click", () => {
  console.log(1);
});

const todo = document.getElementById("todo");
const list = document.getElementById("list");
todo.addEventListener("keydown", (e) => {
  if (e.code == "Enter") {
    list.innerHTML += `<div class="full-width flex row center mid">
    <input id="${countId}" type="checkbox" />
    <label for="${countId}" id="todo-${countId}">aaa</label>
        </div>`;
    countId++;
    todo.value = "";
    console.log(countId);
  }
});
