const yearOptions = [];
for (let i = 2023; i >= 1900; i--) {
  yearOptions.push(i);
}

console.log(yearOptions);

const yearSelect = document.querySelector("#year");

yearOptions.forEach((year) => {
  let opt = document.createElement("option");
  opt.value = year;

  opt.innerHTML = year;
  console.log(opt);
  yearSelect.appendChild(opt);
});
