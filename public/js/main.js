const socket = io();

const yearOptions = [];
for (let i = 2023; i >= 1900; i--) {
  yearOptions.push(i);
}

const yearSelect = document.querySelector("#year");
const tableItemsBox = document.querySelector(".table-items");
const messagesBox = document.querySelector(".chat-msg-box");
const messageInput = document.querySelector("#chat");
const emailInput = document.querySelector("#email");
const nameInput = document.querySelector("#name");
const lastnameInput = document.querySelector("#lastname");
const ageInput = document.querySelector("#age");
const usernameInput = document.querySelector("#username");
const avatarInput = document.querySelector("#avatar");
const greetingText = document.querySelector(".greeting-text");

yearOptions.forEach((year) => {
  let opt = document.createElement("option");
  opt.value = year;

  opt.innerHTML = year;
  yearSelect.appendChild(opt);
});

/* document.querySelector(".sendMessageButton").addEventListener("click", (e) => {
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
    author: {
      id: emailInput.value,
      name: nameInput.value,
      lastname: lastnameInput.value,
      age: ageInput.value,
      username: usernameInput.value,
      avatar: avatarInput.value,
    },
    text: messageInput.value,
    date: dateFormated,
  };

  socket.emit("message", messageObj);

  messageInput.value = "";
}); */

/* socket.on("messages", (msg) => {
  console.log(msg);
  const htmlMessages = msg.result.messages?.map((msg) => {
    return `
    <div class="chat-msg-item">
      <p class="chat-email">${msg.author.id}</p>
      <p class="chat-time">${msg.date}:</p>
      <p class="chat-text">${msg.text}</p>
    </div>`;
  });

  messagesBox.innerHTML = "";

  htmlMessages?.forEach((msg) => {
    messagesBox.insertAdjacentHTML("beforeend", msg);
  });
}); */

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
          <div class="table-img-box">
            <img class="table-img" src="${item.img}" alt="${item.name}" />
          </div>
        </td>
        <td><form action="/admin/product-delete" method="post">
        <input type="hidden" value=${item._id} name="productId"></input>
        <button type="submit" class="btn-delete">-</button>
        </form></td>
      </tr>
    `
    );
  });
});
