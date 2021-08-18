let isBlock = false;
// communicate with background page
chrome.runtime.sendMessage({ type: "matchParent" }, (response) => {
  if (!response.state.listTodo.length) {
    isBlock = false;
  } else {
    response.state.listTodo.forEach((item) => {
      if (item.checked == false) isBlock = true;
    });
    if (response.state.listTodo.every((item) => item.checked == true)) {
      isBlock = false;
    }
  }
  block();
});

function block() {
  if (isBlock) document.getElementsByTagName("BODY")[0].classList.add("hide");
  else document.getElementsByTagName("BODY")[0].classList.remove("hide");
}
