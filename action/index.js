window.oncontextmenu = function () {
  return false; // cancel default menu
};

let state = {
  listTodo: [],
  countId: 0,
  setting: {
    facebook: false,
    youtube: false,
    tiktok: false,
    instagram: false,
  },
  timestate: {
    timeSpace: 0,
    runState: 0,
    posponTime: Date.now(),
  },
};
// list element action
const countdown = document.querySelector(".btn-countdown");
const todoInput = document.getElementById("todo");
const setting = document.querySelector(".btn-setting");
const list = document.getElementById("list");
const todo = document.querySelector(".btn-todo");
const startCountdown = document.querySelector(".start-countdown");
const display = document.querySelector("#time");

const blockFB = document.getElementById("block-facebook");
const blockTT = document.getElementById("block-tiktok");
const blockIN = document.getElementById("block-instagram");
const blockYT = document.getElementById("block-youtube");

const iconST = document.getElementById("icon-setting");
const iconTD = document.getElementById("icon-todo");
const iconCD = document.getElementById("icon-countdown");

// list function
function setStorage() {
  chrome.storage.local.set({ state }, function () {});
}
function removeItem(t) {
  t.remove();
  state.listTodo = state.listTodo.filter((list) => list.id != t.id);
  setStorage();
}

function handleChecked(t) {
  state.listTodo.forEach((item) => {
    if (item.checkedId == t.id) {
      item.checked = !item.checked;
    }
  });
  setStorage();
}

function setOldChecked() {
  document.querySelectorAll(".input-child").forEach((label) => {
    state.listTodo.forEach((item) => {
      if (item.checkedId == label.id) label.checked = item.checked;
    });
  });
}

function startTimer(_timestate, display) {
  var remainingTime = _timestate + 1,
    minutes,
    seconds;

  var myclock = setInterval(function () {
    if (--remainingTime >= 0) {
      minutes = parseInt(remainingTime / 60, 10);
      seconds = parseInt(remainingTime % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      //render time machine
      display.textContent = minutes + ":" + seconds;

      //update time remaining & posponTime
      state.timestate.timeSpace = remainingTime;
      state.timestate.posponTime = Date.now();

      setStorage();
    } else {
      alert("Time Out!");
      state.timestate.runState = 0;
      setStorage();
      clearInterval(myclock);
    }
  }, 1000);
}
// get data from local storage
chrome.storage.local.get(["state"], function (result) {
  if (result.state) {
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
    // set value setting
    state.setting = result.state.setting;
    if (result.state.setting.facebook) blockFB.classList.add("facebook");
    if (result.state.setting.tiktok) blockTT.classList.add("tiktok");
    if (result.state.setting.youtube) blockYT.classList.add("youtube");
    if (result.state.setting.instagram) blockIN.classList.add("instagram");

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

    // for count down
    let newState = result.state.timestate;
    if (newState.runState == 1) {
      document.getElementById("count-machine").style.display = "flex";
      skippedTime = Math.floor((Date.now() - newState.posponTime) / 1000);
      newState.timeSpace -= skippedTime;
      if (newState.timeSpace <= 0) {
        document.getElementById(
          "time"
        ).innerHTML = `<span id="time">Please start!</span>`;
        state.timestate.runState = 0;
        setStorage();
        setTimeout(function (x = "Time out") {
          alert(x);
        }, 500);
      } else {
        //update local timestate
        state.timestate.runState = 1;
        setStorage();
        startTimer(newState.timeSpace, display);
      }
    }
  }
});

// click countdown tab
countdown.addEventListener("click", () => {
  // change interface
  document.getElementById("tab-todo").style.display = "none";
  document.getElementById("tab-setting").style.display = "none";
  document.getElementById("tab-countdown").style.display = "flex";

  todo.classList.remove("action");
  setting.classList.remove("action");
  countdown.classList.add("action");

  iconCD.classList.add("icon-action");
  iconTD.classList.remove("icon-action");
  iconST.classList.remove("icon-action");
});

// click setting tab
setting.addEventListener("click", () => {
  // change interface
  document.getElementById("tab-todo").style.display = "none";
  document.getElementById("tab-setting").style.display = "flex";
  document.getElementById("tab-countdown").style.display = "none";

  todo.classList.remove("action");
  countdown.classList.remove("action");
  setting.classList.add("action");

  iconTD.classList.remove("icon-action");
  iconCD.classList.remove("icon-action");
  iconST.classList.add("icon-action");
});

// click todo tab
todo.addEventListener("click", () => {
  // change interface
  document.getElementById("tab-todo").style.display = "flex";
  document.getElementById("tab-setting").style.display = "none";
  document.getElementById("tab-countdown").style.display = "none";

  countdown.classList.remove("action");
  setting.classList.remove("action");
  todo.classList.add("action");

  iconCD.classList.remove("icon-action");
  iconTD.classList.add("icon-action");
  iconST.classList.remove("icon-action");
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
    setStorage();
  }
});

// setting block fb
blockFB.addEventListener("click", () => {
  state.setting.facebook = !state.setting.facebook;
  if (state.setting.facebook) {
    blockFB.classList.add("facebook");
  } else {
    blockFB.classList.remove("facebook");
  }
  setStorage();
});

// setting block tiktok
blockTT.addEventListener("click", () => {
  state.setting.tiktok = !state.setting.tiktok;
  if (state.setting.tiktok) {
    blockTT.classList.add("tiktok");
  } else {
    blockTT.classList.remove("tiktok");
  }
  setStorage();
});

// setting block youtube
blockYT.addEventListener("click", () => {
  state.setting.youtube = !state.setting.youtube;
  if (state.setting.youtube) {
    blockYT.classList.add("youtube");
  } else {
    blockYT.classList.remove("youtube");
  }
  setStorage();
});

// setting block intagram
blockIN.addEventListener("click", () => {
  state.setting.instagram = !state.setting.instagram;
  if (state.setting.instagram) {
    blockIN.classList.add("instagram");
  } else {
    blockIN.classList.remove("instagram");
  }
  setStorage();
});

startCountdown.addEventListener("click", () => {
  //checking input
  let min = document.getElementById("minute").value;
  let sec = document.getElementById("second").value;

  //accounting timespace
  state.timestate.timeSpace = parseInt((min || 0) * 60 + (sec || 0), 10);
  if (state.timestate.timeSpace == 0 && state.timestate.runState == 0) {
    alert("please set the input!");
  } else {
    document.getElementById("count-machine").style.display = "flex";
    if (state.timestate.runState == 0)
      document.getElementById(
        "time"
      ).innerHTML = `<span id="time">start!</span>`;
    //prevent nestlest clock
    else if (state.timestate.runState == 1) {
      clearInterval(myclock);
    }

    //update state
    state.timestate.runState = 1;
    setStorage();

    // start timer
    startTimer(state.timestate.timeSpace, display);
    document.getElementById("minute").value = null;
    document.getElementById("second").value = null;
  }
});
