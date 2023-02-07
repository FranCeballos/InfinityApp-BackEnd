const yargs = require("yargs");
const args = yargs.argv;

function generateRandoms(amount) {
  const numArray = [];
  for (let i = 0; i < amount; i++) {
    numArray.push(Math.floor(Math.random() * (1000 - 1) + 1));
  }
  const numObj = {};
  numArray.forEach((num) => {
    if (numObj[num]) {
      numObj[num]++;
    } else {
      numObj[num] = 1;
    }
  });
  return numObj;
}

process.on("message", (data) => {
  const amountNum = Number(process.argv[2]) || 100000000;
  const numObj = generateRandoms(amountNum);
  process.send(numObj);
});
