import {
  elCardTemp,
  elParent,
  elLoader,
  errorMessage,
  elModal,
  elCloseModalBtn,
  elOpenModalBtn,
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

const token = localStorage.getItem("token");

if (!token) {
  alert("Iltimos, tizimga kiring!");
  location.href = "/pages/login.html";
}

function init() {
  elLoader.classList.remove("hidden");

  fetch(`https://json-api.uz/api/project/fn44/cars?limit=${limit}&skip=${skip}`)
    .then((res) => res.json())
    .then((res) => {
      ui(res.data);
      if (total === 0) total = res.total;
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
    const elDesc = clone.querySelector("#desc");
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
    elMaxSpeed.innerHTML = `<strong>Max tezligi:</strong> ${element.maxSpeed}`;
    elHorsePower.innerHTML = `<strong>Ot kuchi:</strong> ${element.horsepower}`;
    elColorName.innerHTML = `<strong>Rangi:</strong> ${element.colorName}`;

    elDeleteBtn.id = element.id;
    elEditBtn.id = element.id;

    elParent.prepend(clone);
  });
}

function deleteCar(id, btn) {
  if (!token) {
    alert("Ro`yxatdan o`ting!");
    location.href = "/pages/login.html";
    return;
  }

  btn.innerText = "Loading...";

  fetch(`https://json-api.uz/api/project/fn44/cars/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.text())
    .then(() => {
      alert("✅ Mashina o`chirildi!");
      init();
    })
    .catch(() => {
      alert(" ❌ Xatolik yuz berdi!");
    })
    .finally(() => {
      btn.innerText = "Delete";
      btn.disabled = false;
    });
}

function editCar(id, btn) {
  if (!token) {
    alert("Ro`yxatdan o`ting!");
    location.href = "/pages/login.html";
    return;
  }

  btn.innerText = "Loading...";
  btn.disabled = true;

  fetch(`https://json-api.uz/api/project/fn44/cars/${id}`)
    .then((res) => res.json())
    .then((res) => {
      editedElId = id;

      elAddCarForm.name.value = res.name;
      elAddCarForm.description.value = res.description;
      elAddCarForm.year.value = res.year;
      elAddCarForm.acceleration.value = res.acceleration;
      elAddCarForm.maxSpeed.value = res.maxSpeed;
      elAddCarForm.horsepower.value = res.horsepower;
      elAddCarForm.colorName.value = res.colorName;

      elModal.classList.remove("hidden");
      elModal.classList.add("flex");
    })
    .catch(() => {
      alert("Xatolik yuz berdi!");
    })
    .finally(() => {
      btn.innerText = "Edit";
      btn.disabled = false;
    });
}

function addCar(car) {
  if (!token) {
    alert("Ro‘yxatdan o‘ting!");
    location.href = "/pages/login.html";
    return;
  }

  elLoader.classList.remove("hidden");

  fetch("https://json-api.uz/api/project/fn44/cars", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(car),
  })
    .then((res) => res.json())
    .then((newCar) => {
      alert("✅ Mashina qo‘shildi!");
      elModal.classList.add("hidden");
      elModal.classList.remove("flex");
      elAddCarForm.reset();

      // 🔥 Yangi mashinani UI boshiga qo‘shamiz
      const clone = elCardTemp.cloneNode(true).content;

      const elTitle = clone.querySelector("h2");
      const elDesc = clone.querySelector("#desc");
      const elYear = clone.querySelector("#year");
      const elAcceleration = clone.querySelector("#acceleration");
      const elMaxSpeed = clone.querySelector("#maxSpeed");
      const elHorsePower = clone.querySelector("#horsePower");
      const elColorName = clone.querySelector("#colorName");
      const elDeleteBtn = clone.querySelector(".delete-btn");
      const elEditBtn = clone.querySelector(".edit-btn");

      elTitle.innerHTML = `<strong>${newCar.name}</strong>`;
      elDesc.innerHTML = `<strong>${newCar.description}</strong>`;
      elYear.innerHTML = `<strong>Yili:</strong> ${newCar.year}`;
      elAcceleration.innerHTML = `<strong>Tezlanishi:</strong> ${newCar.acceleration}`;
      elMaxSpeed.innerHTML = `<strong>Max tezligi:</strong> ${newCar.maxSpeed}`;
      elHorsePower.innerHTML = `<strong>Ot kuchi:</strong> ${newCar.horsepower}`;
      elColorName.innerHTML = `<strong>Rangi:</strong> ${newCar.colorName}`;

      elDeleteBtn.id = newCar.id;
      elEditBtn.id = newCar.id;

      elParent.prepend(clone);
    })
    .catch(() => {
      alert("❌ Xatolik yuz berdi!");
    })
    .finally(() => {
      elLoader.classList.add("hidden");
    });
}

function updateCar(id, car) {
  if (!token) {
    alert("Ro‘yxatdan o‘ting!");
    location.href = "/pages/login.html";
    return;
  }

  fetch(`https://json-api.uz/api/project/fn44/cars/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(car),
  })
    .then((res) => res.json())
    .then(() => {
      alert("✅ Mashina yangilandi!");
      elModal.classList.add("hidden");
      elModal.classList.remove("flex");
      elAddCarForm.reset();
      editedElId = null;
      init();
    })
    .catch(() => {
      alert("Xatolik yuz berdi!");
    });
}

elParent.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    if (confirm("Rostan o‘chirmoqchimisiz?")) {
      deleteCar(e.target.id, e.target);
    }
  }

  if (e.target.classList.contains("edit-btn")) {
    editCar(e.target.id, e.target);
  }
});

elOpenModalBtn.addEventListener("click", () => {
  if (token) {
    elModal.classList.remove("hidden");
    elModal.classList.add("flex");
  } else {
    alert("Ro‘yxatdan o‘ting!");
    location.href = "/pages/login.html";
  }
});

elCloseModalBtn.addEventListener("click", () => {
  elModal.classList.add("hidden");
  elModal.classList.remove("flex");
  editedElId = null;
  elAddCarForm.reset();
});

elAddCarForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(elAddCarForm);
  const car = Object.fromEntries(formData.entries());

  if (editedElId) {
    elParent.innerHTML = "";
    updateCar(editedElId, car);
  } else {
    addCar(car);
  }
});

elPrevBtn.addEventListener("click", () => {
  if (skip > 0) {
    skip -= limit;
    page--;
    elCurrentPage.innerText = page;
    elParent.innerHTML = "";
    init();
  }
});

elNextBtn.addEventListener("click", () => {
  if (skip + limit < total) {
    skip += limit;
    page++;
    elCurrentPage.innerText = page;
    elParent.innerHTML = "";
    init();
  }
});
