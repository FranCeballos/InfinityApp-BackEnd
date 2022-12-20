const socket = io();

const yearOptions = [];
for (let i = 2023; i >= 1900; i--) {
  yearOptions.push(i);
}

const yearSelect = document.querySelector("#year");
const tableItemsBox = document.querySelector(".tableItems");
const messagesBox = document.querySelector(".chatMessagesBox");
const messageInput = document.querySelector("#chat");
const emailInput = document.querySelector("#email");

yearOptions.forEach((year) => {
  let opt = document.createElement("option");
  opt.value = year;

  opt.innerHTML = year;
  yearSelect.appendChild(opt);
});

document.querySelector(".sendMessageButton").addEventListener("click", (e) => {
  e.preventDefault();
  const date = new Date();
  const dateFormated = `[${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${date.getFullYear()} ${String(date.getHours()).padStart(
    2,
    "0"
  )}:${String(date.getMinutes()).padStart(2, "0")}:${String(
    date.getSeconds()
  ).padStart(2, "0")}]`;

  const messageObj = {
    email: emailInput.value,
    time: dateFormated,
    text: messageInput.value,
  };

  if (messageInput.value && emailInput.value) {
    socket.emit("message", messageObj);
  }

  messageInput.value = "";
});

socket.on("messages", (msg) => {
  console.log(msg);
  const htmlMessages = msg.map((msg) => {
    const parsedMsg = JSON.parse(msg.message);
    console.log(parsedMsg);
    return `
    <div class="chatMessageItem">
      <p class="chatEmailStyle">${parsedMsg.email}</p>
      <p class="chatTimeStyle">${parsedMsg.time}:</p>
      <p class="chatTextStyle">${parsedMsg.text}</p>
    </div>`;
  });

  messagesBox.innerHTML = "";

  htmlMessages.forEach((msg) => {
    messagesBox.insertAdjacentHTML("beforeend", msg);
  });
});

socket.on("products", (data) => {
  tableItemsBox.innerHTML = "";
  data.forEach((item) => {
    tableItemsBox.insertAdjacentHTML(
      "beforeend",
      `
      <tr>
        <td>${item.name}</td>
        <td>$${item.price}</td>
        <td>
          <div class="tableImgBox">
            <img class="tableImg" src="${item.img}" alt="${item.name}" />
          </div>
        </td>
      </tr>
    `
    );
  });
});
