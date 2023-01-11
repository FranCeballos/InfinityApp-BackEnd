const socket = io();

const yearOptions = [];
for (let i = 2023; i >= 1900; i--) {
  yearOptions.push(i);
}

const yearSelect = document.querySelector("#year");
const tableItemsBox = document.querySelector(".tableItems");
const addProductButton = document.querySelector(".addProductButton");
const messagesBox = document.querySelector(".chatMessagesBox");
const messageInput = document.querySelector("#chat");
const emailInput = document.querySelector("#email");
const serverText = document.querySelector(".serverText");

yearOptions.forEach((year) => {
  let opt = document.createElement("option");
  opt.value = year;

  opt.innerHTML = year;
  yearSelect.appendChild(opt);
});

socket.on("serverInfo", (data) => {
  serverText.innerHTML = `Server: ${data}`;
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

addProductButton.addEventListener("click", (e) => {
  e.proventDefault();
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
    email: emailInput.value,
    time: dateFormated,
    text: messageInput.value,
  };

  if (messageInput.value && emailInput.value) {
    socket.emit("message", messageObj);
  }

  messageInput.value = "";
}); */

/* socket.on("messages", (msg) => {
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
}); */

/* {
    name: "Encanto",
    rating: "PG",
    duration: "1h 49min",
    year: 2021,
    strService: "Disney+",
    price: 120,
    img: "https://media.glamour.mx/photos/61a5602b72142b6f063c09c8/3:2/w_2400,h_1600,c_limit/encantoposter.jpg",
    id: 1
  },
  {
    name: "Lightyear",
    rating: "PG",
    duration: "1h 45min",
    year: 2022,
    strService: "Disney+",
    price: 580,
    img: "https://media.revistagq.com/photos/62b02a11c41190db0294e43b/1:1/w_1496,h_1496,c_limit/Captura%20de%20pantalla%202022-06-20%20a%20las%2010.04.17.png",
    id: 2
  },
  {
    name: "Soul",
    rating: "G",
    duration: "1h 40min",
    year: 2020,
    strService: "Disney+",
    price: 900,
    img: "https://media.glamour.mx/photos/61905ed7a6e030d6480f6a85/master/w_1600%2Cc_limit/245897.jpeg",
    id: 3
  },
  {
    name: "Coco",
    rating: "G",
    duration: "1h 45min",
    year: 2017,
    strService: "Disney+",
    price: 1280,
    img: "https://www.eleconomista.com.mx/__export/1510364639546/sites/eleconomista/img/2017/11/10/coco-1680x1050-miguel-dante-hector-pixar-animation-2017-hd-4k-10160_1.jpg_1902800913.jpg",
    id: 4
  },
  {
    name: "The Last Of Us",
    rating: "R",
    duration: "5h 3min",
    year: "2023",
    strService: "HBO Max",
    price: 1700,
    img: "https://static.hbo.com/2022-11/the-last-of-us-tease-ka-1920_0.jpg",
    id: 5
  },
  {
    name: "Interestelar",
    rating: "PG-13",
    duration: "2h 49min",
    year: "2014",
    strService: "Amazon Prime",
    price: 2300,
    img: "https://cloudfront-us-east-1.images.arcpublishing.com/semana/D6COKJW4HJCKVFR6UJ6M7VOZNE.jpg",
    id: 6
  },
  {
    name: "Black Panther",
    rating: "PG-13",
    duration: "2h 15min",
    year: "2018",
    strService: "Disney+",
    price: 2860,
    img: "https://cdn.britannica.com/36/198336-050-A9B8AA86/Chadwick-Boseman-Tchalla-Black-Panther-Black.jpg",
    id: 7
  }, {
    name: "Harry Potter and the Philosopher's Stone",
    rating: "PG-13",
    duration: "2h 32min",
    year: "2001",
    strService: "HBO Max",
    price: 3350,
    img: "https://media.ambito.com/p/507582f7d3bfa44ce100f76288b86c3c/adjuntos/239/imagenes/039/373/0039373819/1200x675/smart/harry-potter-y-la-piedra-filosofal.png",
    id: 8
  }, {
    name: "Black Widow",
    rating: "PG-13",
    duration: "2h 13min",
    year: "2021",
    strService: "Disney+",
    price: 4320,
    img: "https://www.sol915.com.ar/wp-content/uploads/2021/07/black-widow-2.jpeg",
    id: 9
  }, {
    name: "Treasure Planet",
    rating: "PG",
    duration: "1h 35min",
    year: "2002",
    strService: "Disney+",
    price: 4990,
    img: "https://cdn.hswstatic.com/gif/play/3e4caf8d-759d-4e9a-b516-950847e3bfdb-1920-1080.jpg",
    id: 10
  } */
