"use-strict";
const socket = io();

const messagesBox = document.querySelector(".chat__msgs-box");

socket.on("messages:read", (messages) => {
  console.log(messages);
  const htmlMessages = messages.map((msg) => {
    if (!msg.isAnswered) {
      return `
      <div class="msg__box">
        <p class="msg__question-time-admin font-grey-light">Question by ${msg.name} at ${msg.createdAt}</p>
        <p class="msg__question-text-admin font-grey-light">${msg.question}</p>
        <div class="msg__box">
          <input type="hidden" class="questionId" name="questionId" value="${msg._id}">
          <div>
            <input
              name="answer"
              class="answer-input form-input"
              type="text"
              placeholder="Answer"
              required
            />
            <button class="form-btn chat__btn">
              Answer
            </button>
        </div>
      </div>`;
    }
    return `
      <div class="msg__box">
        <p class="msg__question-time-admin font-grey-light">Question from ${msg.name} at ${msg.createdAt}</p>
        <p class="msg__question-text-admin font-grey-light">${msg.question}</p>
        <p class="msg__answer-text-admin font-grey-light">${msg.answer}</p>
        <p class="msg__answer-time-admin font-grey-light">Answer by Admin at ${msg.answeredAt}</p>
      </div>`;
  });
  messagesBox.innerHTML = "";

  htmlMessages?.forEach((msg) => {
    messagesBox.insertAdjacentHTML("beforeend", msg);
  });
});

const observer = new MutationObserver((mutationsList, observer) => {
  mutationsList.forEach((mutation) => {
    if (mutation.type === "childList") {
      console.log("A Child Node was added or removed");
      const sendButtons = document.getElementsByClassName("chat__btn");
      console.log([...sendButtons]);

      [...sendButtons].forEach((button) => {
        button.addEventListener("click", (e) => {
          const parentElement = e.target.closest(".msg__box");
          const answerInput = parentElement.querySelector(".answer-input");
          const questionIdInput = parentElement.querySelector(".questionId");

          console.log("Hello");

          if (answerInput.value) {
            const messageObj = {
              questionId: questionIdInput.value,
              answer: answerInput.value,
            };
            console.log(messageObj);
            socket.emit("messages:answer", messageObj);
            answerInput.value = "";
          }
        });
      });
    }
  });
});

const config = { childList: true };
observer.observe(messagesBox, config);
