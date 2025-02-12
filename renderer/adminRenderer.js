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
}

window.electronAPI.onContentUpdate((data) => {
  console.log("Fetched data:", data);
  showData(data); // calls the showData function and passes the data as a parameter
});
