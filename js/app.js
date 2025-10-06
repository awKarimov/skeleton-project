import {
  elCardTemp,
  elParent,
  elLoader,
  errorMessage,
  elModal,
  elCloseModalBtn,
  elOpenModalBtn,
  elAddCard,
  elAddCarForm,
  elPrevBtn,
  elNextBtn,
  elCurrentPage,
} from "./html-elements.js";

let editedElId = null;
let skip = 0;
let limit = 5;
let total = 0;
let page = 1;

function init() {
  elLoader.classList.remove("hidden");
  fetch(`https://json-api.uz/api/project/fn44/cars?limit=${limit}&skip=${skip}`)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      ui(res.data);
      if (total === 0) {
        total = res.total;
      }
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
    const elHorsePower = clone.querySelector("#horsePower");
    const elColorName = clone.querySelector("#colorName");
    const elDeleteBtn = clone.querySelector(".delete-btn");
    const elEditBtn = clone.querySelector(".edit-btn");

    elTitle.innerHTML = `<strong>${element.name}</strong>`;
    elDesc.innerHTML = `<strong>${element.description}</strong>`;
    elYear.innerHTML = `<strong>Yili:</strong> ${element.year}`;
    elAcceleration.innerHTML = `<strong>Tezlanishi:</strong> ${element.acceleration}`;
    elMaxSpeed.innerHTML = `<strong>Max Tezligi:</strong> ${element.maxSpeed}`;
    elHorsePower.innerHTML = `<strong>Ot Kuchi:</strong> ${element.horsepower}`;
    elColorName.innerHTML = `<strong>Rangi:</strong> ${element.colorName}`;
    elDeleteBtn.id = element.id;
    elEditBtn.id = element.id;
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

  if (e.target.classList.contains("edit-btn")) {
    e.target.innerHTML = "Loading ...";
    fetch(`https://json-api.uz/api/project/fn44/cars/${e.target.id}`)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        elAddCarForm.name = res.name;
        elAddCarForm.description = res.description;
        elAddCarForm.year = res.year;
        elAddCarForm.acceleration = res.acceleration;
        elAddCarForm.maxSpeed = res.maxSpeed;
        elAddCarForm.horsepower = res.horsepower;
        elAddCarForm.colorName = res.colorName;

        elEditBtn.addEventListener("click", () => {
          elModal.classList.remove("hidden");
          elModal.classList.add("flex");
        });

        elCloseModalBtn.addEventListener("click", () => {
          elModal.classList.add("hidden");
          elModal.classList.remove("flex");
        });
      })
      .catch(() => {
        errorMessage.classList.remove("hidden");
      })
      .finally(() => {
        e.target.innerHTML = "Edit";
      });
  }
});

elOpenModalBtn.addEventListener("click", () => {
  elModal.classList.remove("hidden");
  elModal.classList.add("flex");
});

elCloseModalBtn.addEventListener("click", () => {
  elModal.classList.add("hidden");
  elModal.classList.remove("flex");
});

elAddCarForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(elAddCarForm);
  const car = Object.fromEntries(formData.entries());

  elLoader.classList.remove("hidden");

  fetch("https://json-api.uz/api/project/fn44/cars", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(car),
  })
    .then((res) => res.text())
    .then((res) => {
      elAddCard.addEventListener("click", () => {
        elModal.classList.add("hidden");
      });
      alert("✅ Mashina qo`shildi!");
      elAddCarForm.reset();

      elModal.classList.add("hidden");
      elModal.classList.remove("flex");

      init();
    })
    .catch(() => {
      errorMessage.classList.remove("hidden");
    })
    .finally(() => {
      elLoader.classList.add("hidden");
    });
});

elPrevBtn.addEventListener("click", () => {
  if (skip > 0) {
    skip = skip - limit;
    page -= 1;
    elCurrentPage.innerText = page;
  }
  init();
});

elNextBtn.addEventListener("click", () => {
  skip = skip + limit;

  if (skip <= total) {
    page += 1;
    elCurrentPage.innerText = page;
  }
  init();
});
