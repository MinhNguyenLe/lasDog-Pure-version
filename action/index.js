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
};
var timestate = {
  timeSpace : 0,
  runState: 0,
  posponTime: Date.now()
};
// list element action
const countdown = document.querySelector(".btn-countdown");
const todoInput = document.getElementById("todo");
const setting = document.querySelector(".btn-setting");
const list = document.getElementById("list");
const todo = document.querySelector(".btn-todo");
const startCountdown = document.querySelector(".start-countdown");
const display = document.querySelector('#time');

const blockFB = document.getElementById("block-facebook");
const blockTT = document.getElementById("block-tiktok");
const blockIN = document.getElementById("block-instagram");
const blockYT = document.getElementById("block-youtube");

// list function
function setStorage() {
  chrome.storage.local.set({ state }, function () {});
}
// communicate with background page
function communicateBG() {
  chrome.runtime.sendMessage({ type: "action", state }, (response) => {});
  console.log(state);
}
communicateBG();

function removeItem(t) {
  t.remove();
  state.listTodo = state.listTodo.filter((list) => list.id != t.id);
  setStorage();
  communicateBG();
}

function handleChecked(t) {
  state.listTodo.forEach((item) => {
    if (item.checkedId == t.id) {
      item.checked = !item.checked;
    }
  });
  setStorage();
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
  // set value setting
  state.setting = result.state.setting;
  console.log(state.setting);
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
  communicateBG();
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
  communicateBG();
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
  communicateBG();
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
  communicateBG();
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
  communicateBG();
  setStorage();
});

//handle countdown
startCountdown.addEventListener("click", () => {
  timestate.timeSpace = parseInt(document.getElementById("minute").value, 10) * 60 + parseInt(document.getElementById("second").value, 10);
  //prevent nestlest clock
  if(timestate.runState == 1){
    clearInterval(myclock);
  }
  //update state
  timestate.runState = 1;
  chrome.storage.local.set({timestate}, function(){})
  // start timer
  startTimer(timestate.timeSpace, display);
});
//
function checking() {
  //check the hidden process
  document.getElementById("time").innerHTML = `<span id="time">Checking...</span>`;
  chrome.storage.local.get(["timestate"], function (result) {
    let newState = result.timestate;
    if (newState.runState == 1){
      skippedTime = Math.floor((Date.now() - newState.posponTime) / 1000);
      newState.timeSpace -= skippedTime;
      if(newState.timeSpace <=0)
      {
        alert("Time Out!");
        timestate.runState = 0;
        chrome.storage.local.set({timestate}, function(){})
      }
      else {
        //update local timestate
        timestate.runState = 1;
        chrome.storage.local.set({timestate}, function(){})
        startTimer(newState.timeSpace, display);
      }
    }
    else document.getElementById("time").innerHTML = `<span id="time">Please start!</span>`;
  })
};



function startTimer(_timestate , display) {
  var remainingTime = _timestate,
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
      timestate.timeSpace = remainingTime;
      timestate.posponTime = Date.now();
      chrome.storage.local.set({timestate}, function(){})
    }
    else {
          alert("Time Out!");
          timestate.runState = 0;
          chrome.storage.local.set({timestate}, function(){})
          clearInterval(myclock);
    }
  }, 1000);
}
startCountdown.addEventListener("click", () => {
  timestate.timeSpace = parseInt(document.getElementById("minute").value, 10) * 60 + parseInt(document.getElementById("second").value, 10);
  if(timestate.timeSpace == 0){
    alert("please set the input!")
  }
  else {
    document.getElementById("count-machine").style.display = "flex";
    document.getElementById("time").innerHTML = `<span id="time">start!</span>`;
    //prevent nestlest clock
    if(timestate.runState == 1){
      clearInterval(myclock);
    }
    //update state
    timestate.runState = 1;
    chrome.storage.local.set({timestate}, function(){})
    // start timer
    startTimer(timestate.timeSpace, display);
  }
});
//
function checking() {
  //hide the machine
  //check the hidden process
  // document.getElementById("time").innerHTML = `<span id="time"></span>`;
  chrome.storage.local.get(["timestate"], function (result) {
    let newState = result.timestate;
    if (newState.runState == 1){
      document.getElementById("count-machine").style.display = "flex";
      skippedTime = Math.floor((Date.now() - newState.posponTime) / 1000);
      newState.timeSpace -= skippedTime;
      if(newState.timeSpace <=0)
      {
        document.getElementById("time").innerHTML = `<span id="time">Please start!</span>`;
        timestate.runState = 0;
        chrome.storage.local.set({timestate}, function(){});
        setTimeout(alert("Timeee Out!"), 500);
      }
      else {
        //update local timestate
        timestate.runState = 1;
        chrome.storage.local.set({timestate}, function(){})
        startTimer(newState.timeSpace, display);
      }
    }
  })
};



function startTimer(_timestate , display) {
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
      timestate.timeSpace = remainingTime;
      timestate.posponTime = Date.now();
      chrome.storage.local.set({timestate}, function(){})
    }
    else {
          alert("Time Out!");
          timestate.runState = 0;
          chrome.storage.local.set({timestate}, function(){})
          clearInterval(myclock);
    }
  }, 1000);
}
checking();