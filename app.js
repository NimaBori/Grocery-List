const alertEl = document.querySelector(".alert");
const form = document.querySelector(".form");
const item = document.getElementById("item");
const listItems = document.querySelector(".list-items");

const submitBtn = document.querySelector(".submit-btn");
const clearItemsBtn = document.querySelector(".clear-items");
let lastItem = [];
let listContant = [];

// handle edit option
let editElement;
let editFlag = false;
let editID = "";

// load items
window.addEventListener("DOMContentLoaded", setupItems);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = item.value;
  const UniqueId = Math.random().toString(16).slice(2);
  clearItemsBtn.textContent = "Clear Items";

  if (value && !editFlag) {
    createListItem(UniqueId, value);
    createAlert("item added to your grocery list", "success");
    // add to local storage
    addToLocalStorage(UniqueId, value);
    // set back to defult
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    createAlert("value changed", "success");
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    createAlert("Please enter a value!", "danger");
  }
});

clearItemsBtn.addEventListener("click", () => {
  if (listContant.length > 0) {
    item.value = "";
    listItems.innerHTML = "";
    clearItemsBtn.textContent = "";
  }

  /* item.value = ''
  listItems.innerHTML = '' */
  createAlert("grocery list cleared successfully", "success");
  setBackToDefault();
  localStorage.removeItem("list");
});

// **** functions ****

// add to the list
function createListItem(UniqueId, value) {
  const para = document.createElement("li");
  para.className = "list-contant";
  const itemNode = document.createTextNode(value);
  para.appendChild(itemNode);

  lastItem.push([{ id: UniqueId, itemArray: value }]);

  const editBtn = document.createElement("button");
  const iEdit = document.createElement("i");
  iEdit.className = "fa-solid fa-file-pen";
  editBtn.classList.add("edit-btn");
  editBtn.id = UniqueId;
  editBtn.appendChild(iEdit);
  editBtn.onclick = function (e) {
    editElement = e.currentTarget.previousElementSibling;
    item.value = editElement.innerHTML;
    editFlag = true;
    editID = UniqueId;
    submitBtn.textContent = "Edit";
  };

  const deleteBtn = document.createElement("button");
  const iDelete = document.createElement("i");
  iDelete.className = "fa-solid fa-trash";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.appendChild(iDelete);
  deleteBtn.onclick = function () {
    list = document.querySelectorAll(".list-contant");
    if (list.length === 1) {
      listItems.removeChild(para);
      listItems.removeChild(editBtn);
      listItems.removeChild(deleteBtn);
      clearItemsBtn.textContent = "";
    } else {
      listItems.removeChild(para);
      listItems.removeChild(editBtn);
      listItems.removeChild(deleteBtn);
    }
    createAlert("item removed", "danger");
    removeFromLocalStorage(UniqueId);
  };
  deleteBtn.id = UniqueId;

  listItems.appendChild(para);
  listItems.appendChild(editBtn);
  listItems.appendChild(deleteBtn);

  listContant = document.querySelectorAll(".list-contant");
}

// create alert
function createAlert(text, display) {
  alertEl.innerHTML = text;
  alertEl.classList.add(`alert-${display}`);
  setTimeout(() => {
    alertEl.textContent = "";
    alertEl.classList.remove(`alert-${display}`);
  }, 1500);
}

// set back to default
function setBackToDefault() {
  item.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Submit";
}

// **** local storage ****
function getlocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function addToLocalStorage(UniqueId, value) {
  const grocery = { UniqueId, value };
  let items = getlocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getlocalStorage();
  items = items.map((item) => {
    if (item.UniqueId === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = getlocalStorage();
  items = items.filter((item) => {
    if (item.UniqueId !== id) return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

// **** setup items ****
function setupItems() {
  let items = getlocalStorage();
  if (items.length > 0) {
    items.forEach((element) => {
      createListItem(element.UniqueId, element.value);
    });
  }
  clearItemsBtn.textContent = "";
}
