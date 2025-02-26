/*
    WeeklyFoodlist Desktop Version. Generate random foods to eat for a week.
    Copyright (C) 2025  Juuso Vainikka

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const fishlist = [];
const souplist = [];
const other = [];

// function for randomizing
function random(foodlist, weekslist) {
  const max = 10;
  let attempts = 0;

  while (attempts < max) {
    const chosen = foodlist[Math.floor(Math.random() * foodlist.length)]; // chooses an item from the list at random

    if (!weekslist.includes(chosen)) { // If the weekslist already contains the item -> try again
      return chosen;
    }

    attempts ++;
  }

  throw new Error("All the possible values have been chosen");
}

// function for shuffling using the Fisher-Yates algorithm
function shuffle(foodlist) {
  for (let i = foodlist.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [foodlist[i], foodlist[j]] = [foodlist[j], foodlist[i]];
  }
  return foodlist;
}

// Function for refreshing the list
function refresh() {
  const list = document.getElementById("list");

  let weekslist = []; // This is the list that shows

  weekslist.push(random(fishlist, weekslist)); // Add a random element into the list from the fishlist
  weekslist.push(random(souplist, weekslist)); // Add a random element into the list from the souplist

  // Fill the other parts of the list with random elements from the other list
  for (let i = 2; i < 7; i++) {
    weekslist.push(random(other, weekslist));
  }

  weekslist = shuffle(weekslist); // Shuffle the list so it monday isn't a fish day every week etc

  list.innerHTML = `
  <ul>
    <li id="Mon">Ma: ${weekslist[0]?.Title}</li>
    <li id="Tue">Ti: ${weekslist[1]?.Title}</li>
    <li id="Wed">Ke: ${weekslist[2]?.Title}</li>
    <li id="Thu">To: ${weekslist[3]?.Title}</li>
    <li id="Fri">Pe: ${weekslist[4]?.Title}</li>
    <li id="Sat">La: ${weekslist[5]?.Title}</li>
    <li id="Sun">Su: ${weekslist[6]?.Title}</li>
  </ul>
  `;

  // Shows the description when clicking on a food
  document.getElementById("Mon").addEventListener("click", () =>{
    description(weekslist[0]);
  });
  document.getElementById("Tue").addEventListener("click", () =>{
    description(weekslist[1]);
  });
  document.getElementById("Wed").addEventListener("click", () =>{
    description(weekslist[2]);
  });
  document.getElementById("Thu").addEventListener("click", () =>{
    description(weekslist[3]);
  });
  document.getElementById("Fri").addEventListener("click", () =>{
    description(weekslist[4]);
  });
  document.getElementById("Sat").addEventListener("click", () =>{
    description(weekslist[5]);
  });
  document.getElementById("Sun").addEventListener("click", () =>{
    description(weekslist[6]);
  });
}

// Function for showing the description
function description(food) {
  const popup = document.getElementById("popup");
  const closePopup = document.getElementById("closePopup");
  const popupText = document.getElementById("popup-text");

  popup.classList.add("open");
  popupText.innerText=food.Description;

  closePopup.addEventListener("click", () => {
    popup.classList.remove("open");
  });
}

// Runs the refresh() function when clicking on the refresh button
document.getElementById("refresh").addEventListener("click", () => {
  refresh();
});

// Gets the Array of objects from the backend through the API initialized in the preload.js
window.electronAPI.onContentUpdate((data) => {
  console.log("Fetched data:", data);
  handleFoods(data);
});

// Function for handling the data and putting them inside their own lists
function handleFoods(data) {
  data.forEach(data => {
    switch (data.Category) {
      case "Fish":
        fishlist.push(data);
        break;
      case "Soup":
        souplist.push(data);
        break;
      default:
        other.push(data);
        break;
    }
  });
}
