"use-strict";
const socket = io();

const nameInputElement = document.getElementById("name");
const ratingSelectElement = document.getElementById("rating");
const hourSelectElement = document.getElementById("hours");
const minuteSelectElement = document.getElementById("minutes");
const yearSelectElement = document.getElementById("year");
const streamingServiceSelectElement = document.getElementById("strService");
const priceInputElement = document.getElementById("price");
const prevImgElement = document.getElementById("prevImg");

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

const hourOptions = [];
for (let i = 0; i <= 10; i++) {
  hourOptions.push(i);
}

hourOptions.forEach((hour) => {
  let hourOptionElement = document.createElement("option");
  hourOptionElement.value = hour;

  hourOptionElement.innerHTML = hour;
  hourSelectElement.appendChild(hourOptionElement);
});

const minuteOptions = [];
for (let i = 0; i <= 60; i++) {
  minuteOptions.push(i);
}

minuteOptions.forEach((minute) => {
  let minuteOptionElement = document.createElement("option");
  minuteOptionElement.value = minute;

  minuteOptionElement.innerHTML = minute;
  minuteSelectElement.appendChild(minuteOptionElement);
});

socket.on("product", (data) => {
  const name = data.name;
  const rating = data.rating;
  const strService = data.strService;
  const year = data.year;
  const duration = data.duration;
  const hourDuration = duration.split(" ")[0].replace("h", "");
  const minuteDuration = duration.split(" ")[1].replace("m", "");
  const price = data.price;
  const imgSrc = data.img;

  nameInputElement.value = name;
  ratingSelectElement.value = rating;
  hourSelectElement.value = hourDuration;
  minuteSelectElement.value = minuteDuration;
  yearSelectElement.value = year;
  streamingServiceSelectElement.value = strService;
  priceInputElement.value = price;
  prevImgElement.src = `/${imgSrc}`;
  prevImgElement.alt = name;
});
