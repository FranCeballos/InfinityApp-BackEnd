"use-strict";
const socket = io();

const ratingSelectElement = document.getElementById("rating");
const yearSelectElement = document.getElementById("year");
const streamingServiceSelectElement = document.getElementById("strService");

const yearOptions = [];
for (let i = 2023; i >= 1900; i--) {
  yearOptions.push(i);
}

yearOptions.forEach((year) => {
  let yearOptionElement = document.createElement("option");
  yearOptionElement.value = year;

  yearOptionElement.innerHTML = year;
  yearSelectElement.appendChild(yearOptionElement);
});

socket.on("product", (data) => {
  const rating = data.rating;
  const strService = data.strService;
  const year = data.year;

  ratingSelectElement.value = rating;
  yearSelectElement.value = year;
  streamingServiceSelectElement.value = strService;
});
