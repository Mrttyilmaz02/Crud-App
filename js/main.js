let editMode = false; 
let editItem; 
let editItemId; 
const form = document.querySelector(".form-wrapper");
const input = document.querySelector("#input");
const itemList = document.querySelector(".item-list");
const alert = document.querySelector(".alert");
const addButton = document.querySelector(".submit-btn");
const clearButton = document.querySelector(".clear-btn");

const addItem = (e) => {
  e.preventDefault();
  const value = input.value;
  if (value !== "" && !editMode) {
    const id = new Date().getTime().toString();
    createElement(id, value);
    setToDefault();
    showAlert("Eleman Eklendi", "success");
    addToLocalStorage(id, value);
  } else if (value !== "" && editMode) {
    editItem.innerHTML = value;
    updateLocalStorage(editItemId, value);
    showAlert("Eleman Güncellendi", "success");
    setToDefault();
  }
};

const showAlert = (text, action) => {
  alert.textContent = ` ${text}`;
  alert.classList.add(`alert-${action}`);
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 2000);
};
const deleteItem = (e) => {
  const element = e.target.parentElement.parentElement.parentElement;
  const id = element.dataset.id;
  itemList.removeChild(element);
  removeFromLocalStorage(id);
  showAlert("Eleman Silindi", "danger");
  console.log(itemList);
  if (!itemList.children.length) {
    clearButton.style.display = "none";
  }
};
const editItems = (e) => {
  const element = e.target.parentElement.parentElement.parentElement;
  editItem = e.target.parentElement.parentElement.previousElementSibling;
  input.value = editItem.innerText;
  editMode = true;
  editItemId = element.dataset.id;
  addButton.textContent = "Düzenle";
};
const setToDefault = () => {
  input.value = "";
  editMode = false;
  editItemId = "";
  addButton.textContent = "Ekle";
};
const renderItems = () => {
  let items = getFromLocalStorage();
  console.log(items);
  if (items.length > 0) {
    items.forEach((item) => createElement(item.id, item.value));
  }
};

const createElement = (id, value) => {
  const newDiv = document.createElement("div");
  newDiv.setAttribute("data-id", id);  
  newDiv.classList.add("items-list-item");
  newDiv.innerHTML = `
           <p class="item-name">${value} </p>
            <div class="btn-container">
              <button class="edit-btn">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="delete-btn">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
  `;
  const deleteBtn = newDiv.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = newDiv.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItems);
  itemList.appendChild(newDiv);
  showAlert("Eleman Eklendi", "success");
};
const clearItems = () => {
  const items = document.querySelectorAll(".items-list-item");
  if (items.length > 0) {
    items.forEach((item) => {
      itemList.removeChild(item);
    });
    clearButton.style.display = "none";
    showAlert("Liste Boş", "danger");
    localStorage.removeItem("items");
  }
};
const addToLocalStorage = (id, value) => {
  const item = { id, value };
  let items = getFromLocalStorage();
  items.push(item);
  localStorage.setItem("items", JSON.stringify(items));
};
const getFromLocalStorage = () => {
  return localStorage.getItem("items")
    ? JSON.parse(localStorage.getItem("items"))
    : [];
};
const removeFromLocalStorage = (id) => {
  let items = getFromLocalStorage();
  items = items.filter((item) => item.id !== id);
  localStorage.setItem("items", JSON.stringify(items));
};
const updateLocalStorage = (id, newValue) => {
  let items = getFromLocalStorage();
  items = items.map((item) => {
    if (item.id === id) {
      return { ...item, value: newValue };
    }
    return item;
  });
  localStorage.setItem("items", JSON.stringify(items));
};

form.addEventListener("submit", addItem); 
window.addEventListener("DOMContentLoaded", renderItems);
clearButton.addEventListener("click", clearItems);