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
let deadline = 0;
// list element action
const countdown = document.querySelector(".btn-countdown");
const todoInput = document.getElementById("todo");
const setting = document.querySelector(".btn-setting");
const list = document.getElementById("list");
const todo = document.querySelector(".btn-todo");

const startCountdown = document.querySelector(".start-countdown");
const display = document.querySelector("#time");
const timeOutAudio = document.getElementById("myAudio");

const blockFB = document.getElementById("block-facebook");
const blockTT = document.getElementById("block-tiktok");
const blockIN = document.getElementById("block-instagram");
const blockYT = document.getElementById("block-youtube");

const iconST = document.getElementById("icon-setting");
const iconTD = document.getElementById("icon-todo");
const iconCD = document.getElementById("icon-countdown");

const second = document.getElementById("second");
const minute = document.getElementById("minute");
const timeCD = document.getElementById("time");

const countMachine = document.getElementById("count-machine");
const timeInput = document.getElementById("time-input");
const btnStart = document.querySelector("#btn-start");

const tabTodo = document.getElementById("tab-todo");
const tabSetting = document.getElementById("tab-setting");
const tabCountdown = document.getElementById("tab-countdown");
// list function
function setStyleElement(element, type, style) {
  element.style[type] = style;
}

function addClass(element, className) {
  element.classList.add(className);
}

function removeClass(element, className) {
  element.classList.remove(className);
}

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
  let remainingTime = _timestate,
    minutes,
    seconds;

  let myclock = setInterval(function () {
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
      state.timestate.runState = 0;
      timeCD.innerHTML = `<span id="time">Time out!</span>`;
      timeOutAudio.play();

      setTimeout(function () {
        setStyleElement(countMachine, "display", "none");
        setStyleElement(timeInput, "display", "flex");
      }, 3000);

      setStorage();
      clearInterval(myclock);
    }
  }, 1000);
}

function changeTab(tab, element, icon) {
  return tab.addEventListener("click", () => {
    setStyleElement(tabTodo, "display", "none");
    setStyleElement(tabSetting, "display", "none");
    setStyleElement(tabCountdown, "display", "none");

    setStyleElement(document.getElementById(element), "display", "flex");

    removeClass(todo, "action");
    removeClass(setting, "action");
    removeClass(countdown, "action");

    addClass(tab, "action");

    removeClass(iconCD, "icon-action");
    removeClass(iconTD, "icon-action");
    removeClass(iconST, "icon-action");

    addClass(icon, "icon-action");
  });
}

function appBlocked(blocked, app) {
  return blocked.addEventListener("click", () => {
    state.setting[app] = !state.setting[app];
    if (state.setting[app]) {
      addClass(blocked, app);
    } else {
      removeClass(blocked, app);
    }
    setStorage();
  });
}

function inputCountdown(name, len) {
  return name.addEventListener("input", (e) => {
    if (e.target.value.length > len) {
      let a = e.target.value.toString().slice(0, len);
      e.target.value = parseInt(a);
    }
    if (e.target.value.length >= 1) {
      setStyleElement(btnStart, "color", "#1da1f2");
      setStyleElement(btnStart, "cursor", "pointer");
    } else {
      setStyleElement(btnStart, "color", "#969696");
      setStyleElement(btnStart, "cursor", "default");
    }
  });
}

function enterCountdown(name) {
  return name.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("btn-start").click();
    }
  });
}

function resetValueInput(name, defaultType) {
  name.value = defaultType;
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
    if (result.state.setting.facebook) addClass(blockFB, "facebook");
    if (result.state.setting.tiktok) addClass(blockTT, "tiktok");
    if (result.state.setting.youtube) addClass(blockYT, "youtube");
    if (result.state.setting.instagram) addClass(blockIN, "instagram");

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
      setStyleElement(countMachine, "display", "flex");
      setStyleElement(timeInput, "display", "none");
      skippedTime = Math.floor((Date.now() - newState.posponTime) / 1000);
      newState.timeSpace -= skippedTime;

      if (newState.timeSpace <= 0) {
        state.timestate.runState = 0;
        setStorage();
        document.getElementById(
          "time"
        ).innerHTML = `<span id="time">Time out!</span>`;
        timeOutAudio.play();

        setTimeout(function () {
          setStyleElement(countMachine, "display", "none");
          setStyleElement(timeInput, "display", "flex");
        }, 2000);
      } else {
        //update local timestate
        state.timestate.runState = 1;
        setStorage();
        startTimer(newState.timeSpace, display);
      }
    }
  }
});

changeTab(countdown, "tab-countdown", iconCD);
changeTab(setting, "tab-setting", iconST);
changeTab(todo, "tab-todo", iconTD);

// input todo
todoInput.addEventListener("keydown", (e) => {
  if (e.code == "Enter" && e.target.value.trim().length) {
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
    resetValueInput(todoInput, "");

    setOldChecked();
    setStorage();
  }
});

appBlocked(blockFB, "facebook");
appBlocked(blockTT, "tiktok");
appBlocked(blockYT, "youtube");
appBlocked(blockIN, "instagram");

startCountdown.addEventListener("click", () => {
  //checking input
  let min = document.getElementById("minute").value;
  let sec = document.getElementById("second").value;
  deadline = Date.now() + (min * 60 + sec) * 1000;

  chrome.storage.local.set({ deadline }, function () {});

  //accounting timespace
  state.timestate.timeSpace = parseInt(min || 0) * 60 + (parseInt(sec) || 0);
  setStyleElement(btnStart, "cursor", "default");

  if (state.timestate.timeSpace != 0 || state.timestate.runState != 0) {
    setStyleElement(countMachine, "display", "flex");
    if (state.timestate.runState == 0) {
      timeCD.innerHTML = `<span id="time">start!</span>`;
      //update state
      state.timestate.runState = 1;
      setStorage();

      setStyleElement(btnStart, "color", "#969696");
      setStyleElement(timeInput, "display", "none");

      resetValueInput(minute, null);
      resetValueInput(second, null);
      // start timer
      startTimer(state.timestate.timeSpace, display);
    }
  }
});

inputCountdown(second, 2);
inputCountdown(minute, 3);

enterCountdown(second);
enterCountdown(minute);
