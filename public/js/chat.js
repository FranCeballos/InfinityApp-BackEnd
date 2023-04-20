"use-strict";
const socket = io();

const messagesBox = document.querySelector(".chat__msgs-box");
const messageInput = document.querySelector("#question");
const sendButton = document.querySelector(".chat__btn");
const chatForm = document.querySelector(".chat-form");

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (messageInput.value) {
    const messageObj = {
      question: messageInput.value,
    };

    console.log(messageObj);
    socket.emit("messages:create", messageObj);
    messageInput.value = "";
  }
});

socket.on("messages:read", (messages) => {
  console.log(messages);
  const htmlMessages = messages.map((msg) => {
    if (!msg.isAnswered) {
      return `
      <div class="msg__box">
        <p class="msg__question-time font-grey-light">Question by ${msg.name} at ${msg.createdAt}</p>
        <p class="msg__question-text font-grey-light">${msg.question}</p>
        <p class="msg__answer-text font-grey-light hidden"></p>
        <p class="msg__answer-time font-grey-light"></p>
      </div>`;
    }
    return `
      <div class="msg__box">
        <p class="msg__question-time font-grey-light">Question from ${msg.name} at ${msg.createdAt}</p>
        <p class="msg__question-text font-grey-light">${msg.question}</p>
        <p class="msg__answer-text font-grey-light">${msg.answer}</p>
        <p class="msg__answer-time font-grey-light">Answer by Admin at ${msg.answeredAt}</p>
      </div>`;
  });
  messagesBox.innerHTML = "";

  htmlMessages?.forEach((msg) => {
    messagesBox.insertAdjacentHTML("beforeend", msg);
  });
});
