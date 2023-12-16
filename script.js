const itemForm = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const clearBtn = document.querySelector('#clear');
const filterItem = document.querySelector(`.filter`);
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
    const itemFromStorage = getItemfromLocalStorage()

    itemFromStorage.forEach((item) => {
        addItemToDom(item);
    });
    clearUI();
}

function onAddItemsSubmit(e) {
    e.preventDefault();

    // validate value
    const newItem = itemInput.value;
    if (newItem === "") {
        alert(`Enter the value`);
        return;
    }

    // check for edit mode
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromLocal(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }
    else {
        if (checkIfItemExit(newItem)) {
            alert("Item already exists!")
            return;
        }
    }

    itemInput.value = '';
    addItemToDom(newItem);
    addItemToLocalStorage(newItem);
    clearUI();
}


// createbutton with icon appended
function createbutton(classes) {
    const button = document.createElement('button');
    button.setAttribute("class", classes);
    const icon = createIcon("fa-solid fa-xmark")
    button.appendChild(icon)
    return button;
}

// create icon 
function createIcon(classes) {
    const icon = document.createElement('i');
    icon.setAttribute("class", classes);
    return icon;
}

// Add item to DOM
function addItemToDom(item) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    //append button     
    const button = createbutton("remove-item btn-link text-red");
    li.appendChild(button);

    // append to DOM
    itemList.appendChild(li);
}

// Add item to local storage
function addItemToLocalStorage(item) {
    const localStore = getItemfromLocalStorage();

    localStore.push(item);
    // add into local storage & desserialize
    localStorage.setItem("items", JSON.stringify(localStore))
}

function getItemfromLocalStorage() {
    let itemfromlocalstorage;

    if (localStorage.getItem("items") == null) {
        itemfromlocalstorage = [];
    }
    else {
        // convert json to string
        itemfromlocalstorage = JSON.parse(localStorage.getItem("items"));
    }
    return itemfromlocalstorage;
}

// remove-items
function onClickremove(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement)
    }
    else {
        setItemToEdit(e.target)
    }
};

// checking for duplicate
function checkIfItemExit(item) {
    const itemfromlocalstorage = getItemfromLocalStorage();
    return itemfromlocalstorage.includes(item);
}

// editing list
function setItemToEdit(item) {
    isEditMode = true;
    itemList.querySelectorAll('li').forEach((item) => item.classList.remove('edit-mode'));
    item.classList.add("edit-mode");
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.color = "orange";
    itemInput.value = item.textContent;
}
// remove-items
function removeItem(item) {
    if (confirm("Are you sure?")) {
        item.remove();
    }

    // remove from Local storage
    removeItemFromLocal(item.textContent)
    clearUI();
}

function removeItemFromLocal(item) {
    let itemfromlocalstorage = getItemfromLocalStorage();
    itemfromlocalstorage = itemfromlocalstorage.filter((i) => i !== item);
    localStorage.setItem("items", JSON.stringify(itemfromlocalstorage));
}

// clear all items
function clearAllItem(e) {
    // itemList.innerHTML = " ";
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    // Remove items
    localStorage.clear("items");
    clearUI()
}

// Filter the list
function filterlist(e) {
    const items = itemList.querySelectorAll(`li`);
    const text = e.target.value.toLowerCase();


    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if (itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
        }
        else {
            item.style.display = 'none';
        }
    })
}

// remove clearall filter when items are not avaiable.
function clearUI() {
    itemInput.value = "";
    const itemli = itemList.querySelectorAll(`li`);

    // check items are present in list
    if (itemli.length === 0) {
        clearBtn.style.display = 'none';
        filterItem.style.display = 'none';
    }
    else {
        clearBtn.style.display = 'block';
        filterItem.style.display = 'block';
    }
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.color = '#fff';
}

function init() {

    itemForm.addEventListener('submit', onAddItemsSubmit);
    itemList.addEventListener('click', onClickremove);
    clearBtn.addEventListener('click', clearAllItem);
    filterItem.addEventListener('input', filterlist);
    document.addEventListener('DOMContentLoaded', displayItems);
    clearUI();

}

init()