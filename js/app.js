import {
  elCardTemp,
  elParent,
  elLoader,
  errorMessage,
  elModal,
  elCloseModalBtn,
  elOpenModalBtn,
} from "./html-elements.js";

function init() {
  elLoader.classList.remove("hidden");
  fetch("https://json-api.uz/api/project/fn44/cars")
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      ui(res.data);
    })
    .catch(() => {
      errorMessage.classList.remove("hidden");
    })
    .finally(() => {
      elLoader.classList.add("hidden");
    });
}

init();

function ui(cars) {
  elParent.innerHTML = "";
  cars.forEach((element) => {
    const clone = elCardTemp.cloneNode(true).content;
    const elTitle = clone.querySelector("h2");
    const elDesc = clone.querySelectorAll("#desc");
    const elYear = clone.querySelector("#year");
    const elAcceleration = clone.querySelector("#acceleration");
    const elMaxSpeed = clone.querySelector("#maxSpeed");
    const elHorsePower = clone.querySelector("#horesePower");
    const elColorName = clone.querySelector("#colorName");
    const elDeleteBtn = clone.querySelector(".delete-btn");

    elTitle.innerHTML = `<strong>${element.name}</strong>`;
    elDesc.innerHTML = `<strong>${element.description}</strong>`;
    elYear.innerHTML = `<strong>Yili:</strong> ${element.year}`;
    elAcceleration.innerHTML = `<strong>Tezlanishi:</strong> ${element.acceleration}`;
    elMaxSpeed.innerHTML = `<strong>Max Tezligi:</strong> ${element.maxSpeed}`;
    elHorsePower.innerHTML = `<strong>Ot Kuchi:</strong> ${element.horsepower}`;
    elColorName.innerHTML = `<strong>Rangi:</strong> ${element.colorName}`;
    elDeleteBtn.id = element.id;
    elParent.append(clone);
  });
}

function deleteCar(id) {
  fetch(`https://json-api.uz/api/project/fn44/cars/${id}`, {
    method: "DELETE",
  })
    .then((res) => {
      return res.text();
    })
    .then((res) => {
      alert(res);
      elParent.innerHTML = "";
      init();
    })
    .catch(() => {
      errorMessage.classList.remove("hidden");
    })
    .finally(() => {
      elLoader.classList.add("hidden");
    });
}

function addCar(car) {
  elLoader.classList.remove("hidden");
  fetch("https://json-api.uz/api/project/fn44/cars", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(car),
  })
    .then((res) => res.json())
    .then((res) => {
      init();
    })
    .catch(() => {
      errorMessage.classList.remove("hidden");
    })
    .finally(() => {
      elLoader.classList.add("hidden");
    });
}

// CRUD

elParent.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    if (confirm("Rostan ham o`chirasizmi?")) {
      e.target.innerText = "Loading ...";
      deleteCar(e.target.id);
    }
  }
});

const elAddCarForm = document.getElementById("addCarForm");

elAddCarForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(elAddCarForm);

  const newCar = {
    name: formData.get("name"),
    description: formData.get("description"),
    year: formData.get("year"),
    acceleration: formData.get("acceleration"),
    maxSpeed: +formData.get("maxSpeed"),
    horsepower: +formData.get("horsepower"),
    colorName: formData.get("colorName"),
  };

  addCar(newCar);
  elAddCarForm.reset();
});

elOpenModalBtn.addEventListener("click", () => {
  console.log(1);

  elModal.classList.remove("hidden");
  elModal.classList.add("flex");
});

elCloseModalBtn.addEventListener("click", () => {
  elModal.classList.add("hidden");
  elModal.classList.remove("flex");
});

elAddCarForm.addEventListener("submit", () => {
  elModal.classList.add("hidden");
  elModal.classList.remove("flex");
});
