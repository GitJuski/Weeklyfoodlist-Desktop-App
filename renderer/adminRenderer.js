function getData() {
  window.electronAPI.onContentUpdate((data) => {
    console.log("Fetched data:", data);
    showData(data); // calls the showData function and passes the data as a parameter
  });
}

// Function for dynamically creating a table of foods in the administration page
function showData(data) {
  const table = document.getElementById("table"); // Get the table element from admin.html. This whole table can be done dynamically. For fast prototyping, I decided to make the table headers static.

  // Goes through all the items in the data and creates the row and cells for them
  data.forEach(food => {
    const row = document.createElement("tr");
    const id = document.createElement("td");
    const title = document.createElement("td");
    const desc = document.createElement("td");
    const rating = document.createElement("td");
    const category = document.createElement("td");

    // Add the correct data to each cell
    id.innerText=food.ID;
    title.innerText=food.Title;
    desc.innerText=food.Description;
    rating.innerText=food.Rating;
    category.innerText=food.Category;

    // Add the elements to table
    row.appendChild(id);
    row.appendChild(title);
    row.appendChild(desc);
    row.appendChild(rating);
    row.appendChild(category);
    table.appendChild(row);
  });

  // Add the table to the container element
  document.getElementById("container").appendChild(table);
  console.log(table);
  handleCRUD();
}

// An attempt to prevent XSS vulns
function sanitize(string) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
    "`": "&#x60;",
    "=": "&#x3D;",
  };
  const regex = /[&<>"'/`=]/ig;
  return string.replace(regex, (match) => (map[match]));
}

// THIS IS A MESS THAT NEEDS TO BE CLEANED
function handleCRUD() {

  let createOrUpdate = ""; // Track if trying to update or create

  const popupContainer = document.getElementById("popup-container");
  const createUpdateForm = document.getElementById("create-update-form");
  const deleteForm = document.getElementById("delete-form");
  const updateInput = document.getElementById("update-input");
  const updateLabel = document.getElementById("update-label");

  // Create button actions
  document.getElementById("create").addEventListener("click", () => {
    popupContainer.className = "active";
    createUpdateForm.className = "active";
    createOrUpdate = "create";
    updateInput.className = "unactive";
    updateLabel.className = "unactive";
    deleteForm.className = "unactive";
  });
  // The X button when form is opened
  document.getElementById("close-popup").addEventListener("click", () => {
    popupContainer.className = "unactive";
    updateInput.className = "unactive";
    updateLabel.className = "unactive";
    createUpdateForm.className = "unactive";
    deleteForm.className = "unactive";
  });
  // Actions for submitting the values when clicking on submit button
  document.getElementById("submit-button").addEventListener("click", () => {
    if (createOrUpdate === "create") {
      const title = sanitize(document.getElementById("title-input").value);
      const desc = sanitize(document.getElementById("desc-input").value);
      const rating = sanitize(document.getElementById("rating-select").value);
      const category = sanitize(document.getElementById("category-select").value);

      const submitData = {
        title: title,
        desc: desc,
        rating: rating,
        category: category
      }

      window.electronAPI.createOperations(submitData); // Send the data to the main process (backend)
    }
    else if (createOrUpdate === "update") {
      const id = sanitize(document.getElementById("update-input").value);
      const title = sanitize(document.getElementById("title-input").value);
      const desc = sanitize(document.getElementById("desc-input").value);
      const rating = sanitize(document.getElementById("rating-select").value);
      const category = sanitize(document.getElementById("category-select").value);

      const submitData = {
        ID: id,
        Title: title,
        Description: desc,
        Rating: rating,
        Category: category
      }
      window.electronAPI.updateOperations(submitData); // Send the data to main
    } else {
      console.error("An error occured");
    }
  });

  document.getElementById("update").addEventListener("click", () => {
    popupContainer.className = "active";
    createUpdateForm.className = "active";
    createOrUpdate = "update"; // Set the tracker to update
    updateInput.className = "active";
    updateLabel.className = "active";
    deleteForm.className = "unactive";
  });

  document.getElementById("Delete").addEventListener("click", () => {
    popupContainer.className = "active";
    createOrUpdate = "delete";
    deleteForm.className = "active";
    createUpdateForm.className = "unactive";
    updateLabel.className = "unactive";
    updateInput.className = "unactive";
  });
  document.getElementById("delete-button").addEventListener("click", () => {
    const id = document.getElementById("delete-input").value;
    console.log(id);
    const toDeleteId = parseInt(id, 10); // Parse input to int -> will be NaN if not a number
    // If input number is not a number show an alert box
    if (!isNaN(toDeleteId)) {
      window.electronAPI.deleteOperations(toDeleteId); // Send the ID to the backend
    } else {
      alert("Invalid ID");
    }
  });
}

getData();
